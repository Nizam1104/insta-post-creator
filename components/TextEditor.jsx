"use client"
// import React, { useState, useRef, useEffect } from 'react';

// export default function TextEditor() {
//   const [content, setContent] = useState('editor');
//   const editorRef = useRef(null);
//   const cursorPositionRef = useRef(null);

//   const handleInput = (event) => {
//     const selection = window.getSelection();
//     if (selection.rangeCount > 0) {
//       const range = selection.getRangeAt(0);
//       cursorPositionRef.current = range.startOffset;
//     }
//     setContent(event.target.innerText);
//   };

//   useEffect(() => {
//     if (editorRef.current && cursorPositionRef.current !== null) {
//       const range = document.createRange();
//       const selection = window.getSelection();
//       range.setStart(editorRef.current.childNodes[0], cursorPositionRef.current);
//       range.collapse(true);
//       selection.removeAllRanges();
//       selection.addRange(range);
//     }
//   }, [content]);

//   const styles = {
//     editor: {
//       width: '500px',
//       height: '500px',
//       border: '1px solid #ccc',
//       padding: '10px',
//       boxSizing: 'border-box',
//       overflow: 'auto',
//       backgroundColor: '#fff',
//       color: '#000',
//       fontSize: '16px',
//       lineHeight: '1.5',
//       outline: 'none',
//       aspectRatio: '1 / 1',
//     },
//   };

//   return (
//     <div className="editor-container">
//       <div
//         ref={editorRef}
//         contentEditable='true'
//         style={styles.editor}
//         onInput={handleInput}
//         suppressContentEditableWarning={true}
//         dangerouslySetInnerHTML={{ __html: content }}
//       />
//     </div>
//   );
// }

import React, { useState, useRef, useEffect } from 'react';

const EditableDiv = ({ initialText = '', onTextChange }) => {
  const [text, setText] = useState(initialText || '');
  const divRef = useRef(null);
  const selectionRef = useRef(null);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.innerHTML = initialText.replace(/\n/g, '<br>');
    }

    // Add global click handler
    const handleGlobalClick = (event) => {
      // Only handle clicks if we have a stored selection
      if (selectionRef.current) {
        // Check if the click is inside the editor
        const isClickInside = divRef.current?.contains(event.target);
        
        if (isClickInside) {
          // If clicking inside, clear the selection
          window.getSelection().removeAllRanges();
          selectionRef.current = null;
        } else {
          // If clicking outside, restore the previous selection
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(selectionRef.current);
        }
      }
    };

    document.addEventListener('mousedown', handleGlobalClick);
    
    return () => {
      document.removeEventListener('mousedown', handleGlobalClick);
    };
  }, [initialText]);

  const handleInput = (event) => {
    const newText = event.currentTarget.innerHTML;
    setText(newText);
    if (onTextChange) {
      onTextChange(newText.replace(/<br>/g, '\n'));
    }
  };

  const handleMouseUp = () => {
    // Store selection when text is selected
    const selection = window.getSelection();
    if (selection.rangeCount > 0 && selection.toString().length > 0) {
      selectionRef.current = selection.getRangeAt(0).cloneRange(); // Clone the range to preserve it
    }
  };

  const handleBlur = () => {
    // Only store selection if there is actually selected text
    const selection = window.getSelection();
    if (selection.rangeCount > 0 && selection.toString().length > 0) {
      selectionRef.current = selection.getRangeAt(0).cloneRange();
    }
  };

  return (
    <div
      ref={divRef}
      contentEditable
      onInput={handleInput}
      onBlur={handleBlur}
      onMouseUp={handleMouseUp}
      style={{
        border: '1px solid #ccc',
        padding: '8px',
        height: '500px',
        width: '500px',
        outline: 'none',
        whiteSpace: 'pre-wrap',
      }}
    />
  );
};

export default EditableDiv;
