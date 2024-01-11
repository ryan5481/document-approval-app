import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';
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



const InspectionTextEditor = () => {

    const [editorState, setEditorState] = useState(
        EditorState.createWithContent(
            convertFromRaw({
                blocks: [
                    {
                        key: "3eesq",
                        text: "Comment ...",
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
    //SUBMIT COMMENT
    const [newComment, setNewComment] = useState({});
    const { id } = useParams();
const submitComment = async () => {
    // Fetch status from the server
    try {
        const response = await axios.put(`${baseUrl}/add-comment/${id}`,
            { commentText: newComment });
        if (response.status === 200) {
            window.location.reload()
        } else {
            console.log("Error")
        }
    } catch (error) {
        console.error('Error fetching status:', error);
    }
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

    //COMMENT EDITOR
    const [contentStateJSON, setContentStateJSON] = useState({});

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

    return (
        <>
            <div className='flex flex-col gap-1 items-center justify-center px-40 bg-gray-50' >
                <a className="flex w-full items-start p-2 font-bold">
                    Add a comment
                </a>
                <div className="editor-wrapper"
                //  onClick={focusEditor}
                >
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
                                setNewComment(JSON.stringify(contentStateJSON));
                            }}
                        />
                    </div>
                </div>
            </div>
            <button 
            onClick={submitComment}
            >SUBMIT</button>
        </>
    )
}


export default InspectionTextEditor

