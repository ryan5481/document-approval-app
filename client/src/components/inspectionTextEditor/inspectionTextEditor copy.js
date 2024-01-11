import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom';
import {
    Editor,
    EditorState,
    RichUtils,
    convertToRaw,
    convertFromRaw,
} from "draft-js";
import Toolbar from "./toolbar/toolbar";
import "./TextEditor.css";
import { FaFilePdf } from "react-icons/fa";

const baseUrl = process.env.REACT_APP_BASE_URL


const InspectionTextEditor = () => {

    //GET SUBMISSIONS LIST
    const { id } = useParams();
    const [data, setData] = useState({})

    const getData = async () => {
        try {
            const res = await fetch(`${baseUrl}/get-data/${id}`, {
                method: "GET",
            });
            if (res.status === 200) {
                const data = await res.json()
                setData(data.data)
            }
        } catch {
            console.log("Error")
        }
    }
    useEffect(() => {
        getData()
    }, [])

    //convert JSON to Draft.js content
    const contentState = data?.comment
        ? convertFromRaw(JSON.parse(data.comment))
        : null;

    const previewState = contentState
        ? EditorState.createWithContent(contentState)
        : EditorState.createEmpty();


    //COMMENT EDITOR
    const [contentStateJSON, setContentStateJSON] = useState(null);

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

    return (
        <div className='flex flex-col gap-1 items-center justify-center px-40 bg-gray-50 ' >

            {/* INSTRUCTIONS */}
            {data &&
                <div className='flex flex-col gap-5 w-full rounded-sm bg-gray-100 p-10' >
                    {/* TITLE */}
                    <div className='flex flex-row items-center  gap-2'>
                        <a className="leading-relaxed text-black font-bold min-w-40">
                            Case title:
                        </a>
                        <a className="leading-relaxed text-black font-bold">
                            {data.title}
                        </a>
                    </div>

                    {/* FILES */}
                    <div className='flex flex-row gap-2'>

                        {/* PDF FILE */}
                        <a className="leading-relaxed text-black font-bold min-w-40">
                            Files uploaded:
                        </a>
                        <div className='fl' >
                            <div
                                onClick={() => window.open(`/uploads/documentPdfs/${data.pdfFile}`, '_blank')}
                                className='flex flex-col items-center justify-center p-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer group'
                            >
                                <FaFilePdf
                                    size={60}
                                    className='text-red-500 group-hover:text-red-600'
                                />
                                <a className='text-xs p-1 text-gray-700 group-hover:text-black' >
                                    {data.fileTitle}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* INSTRUCTION VIEWER */}
                    <div className='flex flex-row gap-2'>
                        <a className="leading-relaxed text-black font-bold min-w-40">
                            Instruction:
                        </a>
                        <Editor editorState={previewState} readOnly={true} />
                    </div>

                    {/* CASE DETAILS */}
                    <div className='flex flex-col border-t border-gray-200 p-5'>
                        <div className='flex flex-row gap-5' >
                            <a>Initiated by: {data.initiatorName}</a>
                            <a>Initiated on: {new Date(data.createdAt).toLocaleString()}</a>
                            <a>First assigned to: {data.firstAssigneeName}</a>
                        </div>
                    </div>
                </div>
            }

            {/* ///////////////////////////////////////////////////////////////////////////////////////////////////////// */}
            {/* COMMENTS */}
            <div className='flex flex-col items-center justify-center p-5 w-full bg-gray-100' >
            <a className="flex w-full items-start p-2 font-bold">
                Add a comment
            </a>
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
            </div>
        </div>
    )
}


export default InspectionTextEditor

