import OpenAI from "openai";

const deepseek = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

// const systemPrompt = {
//   role: "system",
//   content: `You are an Instagram content creation assistant. Generate content that fits on a 500x500px canvas.

// Your response must be valid JSON with this simplified structure:

// {
//   "elements": [
//     {
//       "content": "string",
//       "position": {
//         "x": number (0-500),
//         "y": number (0-500),
//         "width": number (10-500),
//         "height": number (10-500)
//       },
//     }
//   ]
// }

// Guidelines:
// - Content  (1-3 lines maximum)
// - Position coordinates must be within canvas boundaries (0-500)
// - Width and height must be positive numbers
// - Maximum 10 elements per design
// - Elements must not overlap or extend beyond canvas edges

// Example response:
// {
//   "elements": [
//     {
//       "content": "5 Tips for Better Sleep",
//       "position": {
//         "x": 50,
//         "y": 50,
//         "width": 400,
//         "height": 80
//       }
//     }
//   ]
// }

// Return only valid JSON without any additional text or comments and without any hashtags or captions to the post.`
// };

// const systemPrompt = {
//   role: "system",
//   content: `You are an Instagram content creation assistant. Generate content that fits on a 500x500px canvas.
// Your response must be valid JSON with this simplified structure:
// {
//   "elements": [
//     {
//       "content": "string",
//       "position": {
//         "x": number (0-500),
//         "y": number (0-500),
//         "width": number (10-500),
//         "height": number (10-500),
//       },
//       "fontSize": number (10-24)
//     }
//   ]
// }

// Guidelines:
// - Content should be explanatory (2-4 sentences) rather than just headings
// - Use smaller font sizes (10-24px) to accommodate more content
// - Position coordinates must be within canvas boundaries (0-500)
// - Width and height must be positive numbers
// - Maximum 10 elements per design
// - Elements must not overlap or extend beyond canvas edges

// Example response:
// {
//   "elements": [
//     {
//       "content": "Quality sleep is essential for your mental and physical health. Studies show that maintaining a consistent sleep schedule and avoiding screens before bedtime can significantly improve your rest. Try to get 7-8 hours each night for optimal benefits.",
//       "position": {
//         "x": 40,
//         "y": 50,
//         "width": 420,
//         "height": 120
//       },
//       "fontSize": 16
//     }
//   ]
// }

// Return only valid JSON without any additional text or comments and without any hashtags or captions to the post.`
// };

const systemPrompt = {
  role: "system",
  content: `You are an Instagram content creation assistant. Generate content that fits on a 500x500px canvas.
Your response must be valid JSON with this simplified structure:
{
  "elements": [
    {
      "type": "heading" | "body",
      "content": "string",
      "position": {
        "x": number (0-500),
        "y": number (0-500),
        "width": number (10-500),
        "height": number (10-500),
      },
      "fontSize": number (10-24),
      "fontWeight": "normal" | "bold"
    }
  ]
}

Guidelines:
- Each post must include at least one heading and one body text element.
- Headings should be concise and attention-grabbing (1-2 sentences).
- Body text should be explanatory and provide value (2-4 sentences).
- Use larger font sizes (18-24px) for headings and smaller font sizes (10-16px) for body text.
- Headings should be bold (fontWeight: "bold"), while body text should be normal (fontWeight: "normal").
- Position coordinates must be within canvas boundaries (0-500).
- Width and height must be positive numbers.
- Ensure elements do not overlap or extend beyond canvas edges.
- Maximum 10 elements per design.
- Maintain visual hierarchy and readability.

Example response:
{
  "elements": [
    {
      "type": "heading",
      "content": "The Importance of Quality Sleep",
      "position": {
        "x": 40,
        "y": 30,
        "width": 420,
        "height": 40
      },
      "fontSize": 22,
      "fontWeight": "bold"
    },
    {
      "type": "body",
      "content": "Quality sleep is essential for your mental and physical health. Studies show that maintaining a consistent sleep schedule and avoiding screens before bedtime can significantly improve your rest. Try to get 7-8 hours each night for optimal benefits.",
      "position": {
        "x": 40,
        "y": 80,
        "width": 420,
        "height": 120
      },
      "fontSize": 16,
      "fontWeight": "normal"
    }
  ]
}

Return only valid JSON without any additional text or comments and without any hashtags or captions to the post.`
};

function validatePosition(position) {
  const defaults = { x: 0, y: 0, width: 100, height: 30 };
  const validated = { ...defaults };
  
  // Ensure values are numbers and within bounds
  validated.x = Math.min(Math.max(0, parseInt(position?.x) || 0), 500);
  validated.y = Math.min(Math.max(0, parseInt(position?.y) || 0), 500);
  validated.width = Math.min(Math.max(10, parseInt(position?.width) || 100), 500);
  validated.height = Math.min(Math.max(10, parseInt(position?.height) || 30), 500);
  
  // Ensure element doesn't extend beyond canvas
  if (validated.x + validated.width > 500) {
    validated.width = 500 - validated.x;
  }
  if (validated.y + validated.height > 500) {
    validated.height = 500 - validated.y;
  }
  
  return validated;
}

function parseAIResponse(content) {
  try {
    // Try direct parse first
    const parsed = JSON.parse(content);
    
    // Validate and sanitize the structure
    const sanitized = {
      elements: Array.isArray(parsed?.elements) ? parsed.elements.map(element => ({
        content: String(element?.content || "").trim(),
        position: validatePosition(element?.position)
      })) : []
    };
    
    // Limit to 5 elements
    sanitized.elements = sanitized.elements.slice(0, 5);
    
    return sanitized;
    
  } catch (error) {
    console.error("Parse error:", error);
    throw new Error("Invalid JSON response from AI");
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    
    if (!body?.messages || !Array.isArray(body.messages)) {
      return Response.json(
        { error: "Invalid messages in request body" },
        { status: 400 }
      );
    }

    const completion = await deepseek.chat.completions.create({
      model: "deepseek-chat",
      messages: [systemPrompt, ...body.messages],
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
