import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom';
import { FaFilePdf } from "react-icons/fa";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import InspectionTextEditor from '../components/inspectionTextEditor/inspectionTextEditor'
const baseUrl = process.env.REACT_APP_BASE_URL


const Inspect = () => {
  ///////// GET SUBMISSIONS LIST /////////
  const { id } = useParams();
  const [data, setData] = useState({})
  const getData = async () => {
    try {
      const res = await fetch(`${baseUrl}/get-submission-by-id/${id}`, {
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
  //convert INSTRUCTION JSON to Draft.js content
  const contentState = data?.instruction
    ? convertFromRaw(JSON.parse(data.instruction))
    : null;
  const previewState = contentState
    ? EditorState.createWithContent(contentState)
    : EditorState.createEmpty();

  //convert INSTRUCTION JSON to Draft.js content
  const getFormatteComment = (unformattedJSON) => {
  const commentState = unformattedJSON
    ? convertFromRaw(JSON.parse(unformattedJSON))
    : null;
  const previewState = commentState
    ? EditorState.createWithContent(commentState)
    : EditorState.createEmpty();
    return previewState
  }

  return (
    <div className='flex flex-col gap-1 items-center justify-center px-40 bg-gray-50'>
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
      {data.comments &&
        data.comments.map((item, index) => (
          <Editor editorState={getFormatteComment(item.commentText)} readOnly={true} />
            ))
          }
          <InspectionTextEditor />
    </div>
  )
}

export default Inspect

{/* <InspectionTextEditor
            data={data}
            previewState={previewState} /> */}