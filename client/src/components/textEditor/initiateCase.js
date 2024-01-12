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

const InitiateCase = () => {
  //EDITOR COMPONENTS
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(
      convertFromRaw({
        blocks: [
          {
            key: "3eesq",
            text: "Instruction ...",
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
  const editor = useRef(null);
  //FORM COMPONENTS
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
  const { userDbId } = useSelector(state => state.user)
  const [selectedPdfFile, setSelectedPdfFile] = useState(null);
  const [contentStateJSON, setContentStateJSON] = useState(null);
  const [title, setTitle] = useState(null);
  const [fileTitle, setFileTitle] = useState(null);

  // const [firstAssignedTo, setFirstAssignedTo] = useState("")

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
      formData.append('fileTitle', fileTitle);
      formData.append('title', title);
      formData.append('instruction', contentStateJSON);
      formData.append('initiatorId', userDbId);
      formData.append('firstAssigneeId', firstAssigneeId);

      const res = await fetch(`${baseUrl}/initiate`, {
        method: "POST",
        body: formData,
        // Don't set Content-Type header when using FormData
      });

      if (res.status === 200) {
        // const response = await res.json();
        // navigate("/submissions");
      } else {
        console.log("An error occurred.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // FETCH LIST OF USERS TO ASSIGN TASK TO
  const [usersList, setUsersList] = useState([])
  const [selectedDept, setSelectedDept] = useState("")
  const getUsersList = async () => {
    try {
      const res = await fetch(`${baseUrl}/get-users-list`, {
        method: "GET",
      });
      if (res.status === 200) {
        const data = await res.json()
        setUsersList(data.data.reverse())
      }
    } catch {
      console.log("Error")
    }
  }
  useEffect(() => {
    getUsersList()
  }, [])

  // CREATE AN ARRAY OF UNIQUE department values from user's list
  const uniqueDepartmentsSet = new Set();
  // Use reduce to create an array of unique key-value pairs
  const uniqueDepartmentsArray = usersList.reduce((accumulator, user) => {
    const { department } = user;
    if (!uniqueDepartmentsSet.has(department)) {
      uniqueDepartmentsSet.add(department);
      accumulator.push({ department });
    }
    return accumulator;
  }, []);

  //GET LIST OF USERS FROM SELECTED DEPARTMENT
  const filteredUsers = usersList.filter((user) => user.department === selectedDept);
  const initialAssignedTo = filteredUsers.length > 0 ? filteredUsers[0]._id : "";
  const [firstAssigneeId, setFirstAssigneeId] = useState(initialAssignedTo);


  return (
    <div className="w-full flex justify-center bg-slate-800 min-h-screen" >
      
      <form
        className="flex flex-col justify-top gap-2 bg-gray-100 p-5"
        onSubmit={handleSubmit}>
          <label
          className="flex w-full items-center justify-center mb-2 text-2xl font-bold text-gray-900">
          Initiate Case
        </label>
        <label
          className="block mb-2 text-md font-bold text-gray-900">
          Task details
        </label>
        {/* TITLE */}
        <div className="w-full flex flex-col gap-1" >
          <label htmlFor="userType" className="block mb-2 text-sm font-medium text-gray-900">
            Case title:
          </label>
          <input
            placeholder="Title"
            id="title"
            name='title'
            required={true}
            value={formData.title}
            onChange={(e) => setTitle(e.target.value)}
            class="block w-full text-gray-900 px-3 font-bold h-10 border border-gray-300 rounded-sm cursor-pointer bg-gray-50 focus:outline-none"
          />
        </div>
        {/* FILE UPLOAD */}
        <div className="w-full flex flex-row justify-stretch gap-1" >
          <div className="flex flex-col gap-1 w-full" >
            <label htmlFor="userType" className="block mb-2 text-sm font-medium text-gray-900">
              Upload file:
            </label>
            <input
              class="flex items-center justify-center w-full h-10 text-sm text-gray-900 border border-gray-300 rounded-sm cursor-pointer bg-gray-50 focus:outline-none"
              type="file"
              onChange={(event) => { handleFileSelect(event) }}
            />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="userType" className="block mb-2 text-sm font-medium text-gray-900">
              File title:
            </label>
            <input
              placeholder="File title"
              id="fileTitle"
              name='fileTitle'
              required={true}
              value={formData.fileTitle}
              onChange={(e) => setFileTitle(e.target.value)}
              class="block w-full text-gray-900 px-3 h-10 border border-gray-300 rounded-sm cursor-pointer bg-gray-50 focus:outline-none"
            />
          </div>

        </div>
        <label htmlFor="userType" className="block mb-2 text-sm font-medium text-gray-900">
          Instruction:
        </label>
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
                // console.log(JSON.stringify(contentStateJSON, null, 2)); // Use null and 2 for pretty printing
              }}
            />
          </div>
        </div>
        {/* ASSIGN TO DEPARTMENT USER */}
        <div className="mt-5 border-t border-gray-200 pt-2">
          <label
            className="block mb-2 text-md font-bold text-gray-900">
            Assign task
          </label>
        </div>
        <div className="flex flex-row gap-2 justify-stretch">
          {/* SELECT DEPARTMENT */}
          <div className="flex flex-col w-full rounded-xs">
            <label
              className="block mb-2 text-sm font-medium text-gray-900">
              Department:
            </label>
            <select
              required={true}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 mb-3 text-sm rounded-xs focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              {uniqueDepartmentsArray.reverse().map((item, index) => (
                <option value={item.department}>
                  {item.department}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col w-full rounded-xs">
            {/* SELECT USER */}
            <label htmlFor="userType" className="block mb-2 text-sm font-medium text-gray-900">
              User:
            </label>
            <select
              required={true}
              onChange={(e) => setFirstAssigneeId(e.target.value) || filteredUsers[0]?._id}
              className="bg-gray-50 border border-gray-300 text-gray-900 mb-3 text-sm rounded-xs focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              {filteredUsers.map((item, index) => (
                <option value={item._id}>
                  {item.fullName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-center w-full m-1" >
          <button type='submit' className="bg-blue-500 hover:bg-blue-600 text-white rounded-sm w-40 font-bold" > Submit</button>
        </div>
      </form>
    </div>
  );
};

export default InitiateCase;
