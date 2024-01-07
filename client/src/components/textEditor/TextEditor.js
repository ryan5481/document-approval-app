import React, { useEffect, useRef, useState } from "react";
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import Toolbar from "./toolbar/toolbar";
import "./TextEditor.css";
const baseUrl = process.env.REACT_APP_BASE_URL


const TextEditor = () => {
  //EDITOR COMPONENTS
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(
      convertFromRaw({
        blocks: [
          {
            key: "3eesq",
            text: "Comment here",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [
              {
                offset: 19,
                length: 6,
                style: "BOLD",
              },
              {
                offset: 25,
                length: 5,
                style: "ITALIC",
              },
              {
                offset: 30,
                length: 8,
                style: "UNDERLINE",
              },
            ],
            entityRanges: [],
            data: {},
          }
        ],
        entityMap: {},
      })
    )
  );
  const [contentInJSON, setContentInJSON] = useState({})
  const editor = useRef(null);
  //FORM COMPONENTS
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  //EDITOR COMPONENTS
  useEffect(() => {
    focusEditor();
  }, []);

  const focusEditor = () => {
    editor.current.focus();
  };

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return true;
    }
    return false;
  };

  // FOR INLINE STYLES
  const styleMap = {
    CODE: {
      backgroundColor: "rgba(0, 0, 0, 0.05)",
      fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
      fontSize: 16,
      padding: 2,
    },
    HIGHLIGHT: {
      backgroundColor: "#F7A5F7",
    },
    UPPERCASE: {
      textTransform: "uppercase",
    },
    LOWERCASE: {
      textTransform: "lowercase",
    },
    CODEBLOCK: {
      fontFamily: '"fira-code", "monospace"',
      fontSize: "inherit",
      background: "#ffeff0",
      fontStyle: "italic",
      lineHeight: 1.5,
      padding: "0.3rem 0.5rem",
      borderRadius: " 0.2rem",
    },
    SUPERSCRIPT: {
      verticalAlign: "super",
      fontSize: "80%",
    },
    SUBSCRIPT: {
      verticalAlign: "sub",
      fontSize: "80%",
    },
  };

  // FOR BLOCK LEVEL STYLES(Returns CSS Class From DraftEditor.css)
  const myBlockStyleFn = (contentBlock) => {
    const type = contentBlock.getType();
    switch (type) {
      case "blockQuote":
        return "superFancyBlockquote";
      case "leftAlign":
        return "leftAlign";
      case "rightAlign":
        return "rightAlign";
      case "centerAlign":
        return "centerAlign";
      case "justifyAlign":
        return "justifyAlign";
      default:
        break;
    }
  };

  //FORM COMPONENTS
  const { fullName, id } = useSelector(state => state.user)
  const [selectedPdfFile, setSelectedPdfFile] = useState(null);
  const [contentStateJSON, setContentStateJSON] = useState(null);
  const [title, setTitle] = useState(null);

  const handleFileSelect = (event) => {
    setSelectedPdfFile(event.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (selectedPdfFile) {
        formData.append('pdfFile', selectedPdfFile, selectedPdfFile.name);
      }
      formData.append('title', title);
      formData.append('comment', contentStateJSON);
      formData.append('initiatorName', fullName);
      formData.append('initiatorId', id);
  
      const res = await fetch(`${baseUrl}/initiate`, {
        method: "POST",
        body: formData,
        // Don't set Content-Type header when using FormData
      });
  
      if (res.status === 200) {
        const response = await res.json();
        navigate("/submissions");
      } else {
        console.log("An error occurred.");
      }
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div className="w-full flex justify-center" >
      <form
      className="flex flex-col justify-center gap-5 m-10"
       onSubmit={handleSubmit}>
        {/* TITLE */}
        <div className="w-full flex flex-col gap-1" >
          <label className="pl-1" >Title</label>
          <input
            id="title"
            name='title'
            required={true}
            value={formData.title}
            onChange={(e) => setTitle(e.target.value)}
            class="block w-full text-gray-900 px-3 font-bold h-10 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none" 
          />
        </div>
        <div className="w-full flex flex-col gap-1" >
          <label className="pl-1" >Upload file</label>
          <input
          class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none" 
          type="file" 
          onChange={(event) => { handleFileSelect(event) }}
          />
        </div>
        <div className="editor-wrapper" onClick={focusEditor}>
          <Toolbar editorState={editorState} setEditorState={setEditorState} />
          <div className="editor-container">
            <Editor
              ref={editor}
              handleKeyCommand={handleKeyCommand}
              editorState={editorState}
              customStyleMap={styleMap}
              blockStyleFn={myBlockStyleFn}
              onChange={(editorState) => {
                setEditorState(editorState);
                const contentState = editorState.getCurrentContent();
                const contentStateJSON = convertToRaw(contentState);
                setContentStateJSON(JSON.stringify(contentStateJSON));
                console.log(JSON.stringify(contentStateJSON, null, 2)); // Use null and 2 for pretty printing

              }}
            />
          </div>
        </div>
        <div className="flex items-center justify-center w-full m-1" >
        <button type='submit' className="bg-blue-400 hover:bg-blue-500 text-white rounded-lg w-40 font-bold" > Submit</button>
        </div>
      </form>
    </div>
  );
};

export default TextEditor;
