"use client";

import { useState, useRef, useEffect } from "react";
import html2canvas from 'html2canvas';
import Editor from "@monaco-editor/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from "../ui/dialog";
import { Button } from "../ui/button";

export default function CreateCodeScreenShot() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("vs-dark");
  const [background, setBackground] = useState("#94e3fe");
  const [backgroundType, setBackgroundType] = useState("solid");
  const [gradientColors, setGradientColors] = useState(["#000000", "#000000"]);
  const [editorHeight, setEditorHeight] = useState(400);
  const [editorWidth, setEditorWidth] = useState(800);

  const [screenShotTitle, setScreenShotTitle] = useState("")

  const [showLineNumbers, setShowLineNumbers] = useState(false);

  const isResizing = useRef(false);
  const resizeDirection = useRef(null);
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  // Handle resize functionality
  const handleMouseDown = (e, direction) => {
    e.preventDefault();
    isResizing.current = true;
    resizeDirection.current = direction;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isResizing.current || !editorRef.current) return;

    const rect = editorRef.current.getBoundingClientRect();
    const maxHeight = 500;
    const maxWidth = 800;

    if (resizeDirection.current === "vertical") {
      const newHeight = e.clientY - rect.top;
      setEditorHeight(Math.max(200, Math.min(maxHeight, newHeight)));
    } else if (resizeDirection.current === "horizontal") {
      const newWidth = e.clientX - rect.left;
      setEditorWidth(Math.max(400, Math.min(maxWidth, newWidth)));
    }
  };

  const handleMouseUp = () => {
    isResizing.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  // Cleanup event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleEditorDidMount = (editor, monaco) => {
    monacoRef.current = monaco;
    monaco.editor.defineTheme("one-dark-pro", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "", foreground: "ABB2BF", background: "282C34" },
        { token: "comment", foreground: "5C6370", fontStyle: "italic" },
        { token: "keyword", foreground: "C678DD" },
        { token: "number", foreground: "D19A66" },
        { token: "string", foreground: "98C379" },
        { token: "type", foreground: "E5C07B" },
        { token: "function", foreground: "61AFEF" },
        { token: "variable", foreground: "E06C75" },
        { token: "operator", foreground: "56B6C2" },
      ],
      colors: {
        "editor.background": "#282C34",
        "editor.foreground": "#ABB2BF",
        "editorCursor.foreground": "#528BFF",
        "editor.lineHighlightBackground": "#2C313A",
        "editorLineNumber.foreground": "#495162",
        "editor.selectionBackground": "#3E4451",
        "editor.inactiveSelectionBackground": "#3E4451",
      },
    });
    monaco.editor.setTheme("one-dark-pro");
  };

  const handleDownloadScreenshot = (scale = 1) => {
    const container = document.getElementById('screenShotContainer');
    if (!container) return;
  
    html2canvas(container, {
      scale,
      useCORS: true,
      allowTaint: true,
      logging: true,
      backgroundColor: null // To maintain transparency
    }).then(canvas => {
      const now = new Date();
      const timeStampinDateMonthYear = now.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).replace(/ /g, '-');
      const time24hr = now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).replace(/:/g, '-');
      const link = document.createElement('a');
      link.download = screenShotTitle ? `${screenShotTitle}-${timeStampinDateMonthYear}-${time24hr}.png` : `code-screen-shot-${timeStampinDateMonthYear}-${time24hr}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger className="bg-gray-800 text-gray-100 hover:bg-gray-700 px-4 py-2 rounded-md text-sm font-medium">
          Code Picture
        </DialogTrigger>
        <DialogContent className="bg-gray-900 border-gray-700 max-w-4xl">
          <DialogHeader>
            <div className="flex justify-between items-center">
            <DialogTitle className="text-gray-400">
              Create Screenshot from code
            </DialogTitle>
            <DialogClose>
              <Button size="sm">
                Close
              </Button>
            </DialogClose>
            </div>

            <DialogDescription asChild>
              <div className="text-gray-400">
                <div className="flex flex-col gap-4 mt-4">
                  <div className="flex gap-4">
                  <input
                    type="text"
                    value={screenShotTitle}
                    onChange={(e) => setScreenShotTitle(e.target.value)}
                    placeholder={language.toUpperCase()}
                    className="w-[80px] max-w-[120px] px-2 py-1 bg-gray-800 text-gray-100 rounded-md border border-gray-700 focus:border-gray-600 focus:ring-1 focus:ring-gray-600 focus:outline-none transition-colors"
                  />
                    
                    <Select value={language} onValueChange={setLanguage} className="">
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="html">HTML</SelectItem>
                        <SelectItem value="css">CSS</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vs-dark">Dark</SelectItem>
                        <SelectItem value="vs-light">Light</SelectItem>
                        <SelectItem value="hc-black">High Contrast</SelectItem>
                        <SelectItem value="one-dark-pro">
                          One Dark Pro
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-2">
                      <Select value={backgroundType} onValueChange={setBackgroundType}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Background Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solid">Solid</SelectItem>
                          <SelectItem value="gradient">Gradient</SelectItem>
                        </SelectContent>
                      </Select>
                      {backgroundType === "solid" ? (
                        <input
                          type="color"
                          value={background}
                          onChange={(e) => setBackground(e.target.value)}
                          className="w-10 h-10 rounded-md cursor-pointer"
                        />
                      ) : (
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={gradientColors[0]}
                            onChange={(e) => setGradientColors([e.target.value, gradientColors[1]])}
                            className="w-10 h-10 rounded-md cursor-pointer"
                          />
                          <input
                            type="color"
                            value={gradientColors[1]}
                            onChange={(e) => setGradientColors([gradientColors[0], e.target.value])}
                            className="w-10 h-10 rounded-md cursor-pointer"
                          />
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={() => setShowLineNumbers(!showLineNumbers)}
                      className="px-2 py-1 bg-gray-800 font-semibold text-sm text-gray-400"
                    >
                      {showLineNumbers
                        ? "line numbers"
                        : "line numbers"}
                    </Button>
                  </div>

                  <div className="flex justify-center items-center">
                    <div
                      id="screenShotContainer"
                      className="px-12 py-8 rounded-md"
                      style={{
                        background: backgroundType === "solid" 
                          ? background 
                          : `linear-gradient(135deg, ${gradientColors[0]}, ${gradientColors[1]})`,
                        width: `${editorWidth}px`,
                      }}
                    >
                      <div
                        ref={editorRef}
                        className="relative rounded-md overflow-hidden w-full h-auto bg-black"
                      >
                        <div className="rounded-lg">
                          <div className="flex justify-between items-center my-2 px-2">
                            <div className="flex space-x-2">
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                            <div className="flex-1 text-center">
                              <span className="text-gray-400 font-semibold text-sm bg-transparent border-none ring-0 focus:ring-0 focus:border-none focus:outline-none text-center">
                                {screenShotTitle || language.toUpperCase()}
                              </span>
                            </div>
                            <div className="w-[48px]" />
                          </div>
                          <div
                            className="relative rounded-lg"
                            style={{ height: `${editorHeight}px` }}
                          >
                            <Editor
                              height={`${editorHeight}px`}
                              width={`${editorWidth}px`}
                              language={language}
                              value={code}
                              theme={theme}
                              onChange={setCode}
                              onMount={handleEditorDidMount}
                              options={{
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                fontSize: 14,
                                lineNumbers: showLineNumbers ? "on" : "off",
                                roundedSelection: false,
                                scrollbar: {
                                  vertical: "visible",
                                  horizontal: "visible",
                                },
                                overviewRulerLanes: 0,
                                hideCursorInOverviewRuler: true,
                                lineDecorationsWidth: 0,
                                contextmenu: false,
                                fontFamily:
                                  "'JetBrains Mono', 'Fira Code', 'Source Code Pro', monospace",
                                lineHeight: 21,
                                renderWhitespace: "none",
                                renderIndentGuides: false,
                                renderLineHighlight: "none",
                                renderValidationDecorations: "off",
                              }}
                            />
                          </div>

                          <div
                            className="absolute bottom-0 left-0 right-0 h-1 cursor-ns-resize bg-transparent hover:bg-blue-500/50 transition-colors"
                            onMouseDown={(e) => handleMouseDown(e, "vertical")}
                          />
                          <div
                            className="absolute top-0 bottom-0 right-0 w-1 cursor-ew-resize bg-transparent hover:bg-blue-500/50 transition-colors"
                            onMouseDown={(e) =>
                              handleMouseDown(e, "horizontal")
                            }
                          />
                          <div
                            className="absolute bottom-0 right-0 w-2 h-2 cursor-nwse-resize bg-transparent hover:bg-blue-500/50 transition-colors"
                            onMouseDown={(e) => {
                              resizeDirection.current = "both";
                              handleMouseDown(e, "both");
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h1>Download</h1>
                    <div className="flex gap-4">
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex-1 flex flex-col items-center"
                        onClick={() => handleDownloadScreenshot(1)}
                      >
                        <span>Low Quality</span>
                        <span className="text-xs text-gray-300"></span>
                      </button>
                      <button
                        className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md flex-1 flex flex-col items-center"
                        onClick={() => handleDownloadScreenshot(3)}
                      >
                        <span>Medium Quality</span>
                        <span className="text-xs text-gray-300"></span>
                      </button>
                      <button
                        className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md flex-1 flex flex-col items-center"
                        onClick={() => handleDownloadScreenshot(5)}
                      >
                        <span>High Quality</span>
                        <span className="text-xs text-gray-300"></span>
                      </button>
                      <button
                        className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md flex-1 flex flex-col items-center"
                        onClick={() => handleDownloadScreenshot(10)}
                      >
                        <span>Very High Quality</span>
                        <span className="text-xs text-gray-300"></span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
