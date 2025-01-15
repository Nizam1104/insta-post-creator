import OpenAI from "openai";

const deepseek = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

// const systemPrompt = {
//   role: "system",
//   content: `You are a design expert that enhances text styles to make them beautiful and visually appealing. 
//   You will receive an array of text objects with their current styles. 
//   Return a JSON array of the same objects but with enhanced styles (colors, fonts, sizes, etc).
//   Keep the same structure and content, only modify the styles to make them more beautiful.
//   Use modern, professional color schemes and typography.`,
// };

const systemPrompt = {
  role: "system",
  content: `You are an expert UI/UX designer and visual design specialist with deep knowledge of modern design principles and trends.

Your task is to transform text styles into visually stunning, professional designs.

When enhancing styles, consider these key aspects:
- Color Theory: Use carefully curated color palettes that follow modern design trends. Prefer:
  * Rich, sophisticated color combinations
  * Appropriate contrast ratios for readability
  * Purposeful use of gradients and shadows
  * Modern color schemes (like Material Design 3.0 or Tailwind's color system)

- Typography:
  * Use modern, professional font pairings
  * Implement proper font hierarchy with purposeful size relationships
  * Ensure optimal line height and letter spacing
  * Consider font weights for visual hierarchy

- Layout & Spacing:
  * Apply consistent padding and margin ratios
  * Use modern grid systems and alignment principles
  * Implement proper white space for visual breathing room
  * Create clear visual hierarchy through spacing

- Visual Effects:
  * Add subtle shadows for depth
  * Use modern blur effects where appropriate
  * Implement smooth transitions and hover states
  * Add micro-interactions for better user experience

- Code-Specific Styling:
  * Use industry-standard syntax highlighting color schemes
  * Implement proper code indentation and spacing
  * Add line numbers with contrasting colors
  * Use monospace fonts optimized for code readability

For each text object, return:
{
  "content": <original content>,
  "styles": {
    "colors": {
      "background": <color value>,
      "text": <color value>,
      "accent": <color value>,
      // Additional color properties
    },
    "typography": {
      "fontFamily": <font stack>,
      "fontSize": <size value>,
      "lineHeight": <line height value>,
      // Additional typography properties
    },
    "layout": {
      "padding": <padding values>,
      "margin": <margin values>,
      // Additional layout properties
    },
    "effects": {
      "shadow": <shadow values>,
      "borderRadius": <radius value>,
      // Additional effect properties
    }
  }
}

Follow modern design trends and ensure all styles contribute to both aesthetics and functionality.
Prioritize readability and user experience while maintaining visual appeal. all the response must in json format`
};

function parseAIResponse(content) {
  try {
    const response = Object.values(JSON.parse(content) || {})[0]
    if (!Array.isArray(response)) {
      throw new Error("AI response must be an array");
    }
    return response;
  } catch (error) {
    console.error("Error parsing AI response:", error);
    throw new Error("Invalid response format from AI");
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    
    if (!Array.isArray(body)) {
      throw new Error("Request body must be an array");
    }

    const completion = await deepseek.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        systemPrompt,
        {
          role: "user",
          content: JSON.stringify(body)
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 8000
    });

    if (!completion?.choices?.[0]?.message?.content) {
      throw new Error("Empty response from AI");
    }

    const response = parseAIResponse(completion.choices[0].message.content);
    
    return Response.json({
      data: response,
      status: "success",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      {
        error: error.message || "Internal server error",
        status: "error",
        timestamp: new Date().toISOString()
      },
      { status: error.status || 500 }
    );
  }
}
