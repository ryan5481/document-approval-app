import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { FaFilePdf, FaExternalLinkSquareAlt } from "react-icons/fa";

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
    <div className='flex flex-col gap-2 items-center justify-center px-40 bg-green-900'>
      {/* INSTRUCTIONS */}
      {data &&
        <div className='flex flex-col gap-5 w-full rounded-b-lg  bg-white p-5' >
          {/* TITLE */}
          <div className='flex flex-row items-center  gap-2'>
            <a className="leading-relaxed text-black text-sm font-bold min-w-40">
              Case title:
            </a>
            <a className="leading-relaxed text-black text-sm font-bold">
              {data.title}
            </a>
          </div>

          {/* FILES */}
          <div className='flex flex-row gap-2'>

            {/* PDF FILE */}
            <a className="leading-relaxed text-black text-sm font-bold min-w-40">
              Files uploaded:
            </a>
            <div className='fl' >
              <div
                onClick={() => window.open(`/uploads/documentPdfs/${data.pdfFile}`, '_blank')}
                className='flex flex-col items-center justify-center p-1 py-2 bg-gray-300 hover:bg-white rounded-md cursor-pointer group'
              >
                <FaFilePdf
                  size={60}
                  className='text-red-500 group-hover:text-red-600'
                />
                <a className='flex flex-row items-center justify-center gap-1 text-xs p-1 text-white group-hover:text-black' >
                  {data.fileTitle} <FaExternalLinkSquareAlt />
                </a>
              </div>
            </div>
          </div>

          {/* INSTRUCTION VIEWER */}
          <div className='flex flex-row gap-2'>
            <a className="leading-relaxed text-black font-bold text-sm min-w-40">
              Instruction:
            </a>
            <Editor editorState={previewState} readOnly={true} />
          </div>

          {/* CASE DETAILS */}
          <div className='flex flex-col border-t border-gray-400 pt-3 text-xs'>
            <div className='flex flex-row gap-5' >
              <span>
                <a className='font-bold' >Initiated by: </a>
                <a>{data.initiatorName}</a>
              </span>
              <span>
                <a className='font-bold' >Initiated on: </a>
                <a>{new Date(data.createdAt).toLocaleString()}</a>
              </span>
              <span>
                <a className='font-bold' >First assigned to: </a>
                <a>{data.firstAssigneeName}</a>
              </span>
            </div>
          </div>
        </div>
      }

      {/* //////// COMMENTS ////////// */}
      <div className='flex flex-col gap-5 w-full bg-gray-200 px-10 py-5 rounded-md' >
        {/* INSTRUCTION VIEWER */}
        <div className='flex flex-col gap-2'>
          <a className="leading-relaxed text-black font-bold border-b border-gray-500 py-2 min-w-40">
            Inspection comments:
          </a>
          {data.comments &&
          data.comments.length > 0 ?
            (
              data.comments.map((item, index) => (
              <div>
                <div className='flex flex-col py-2 text-xs'>
                  <div className='flex flex-row gap-5' >
                    <span>
                      <a className='font-bold' >Inspected by: </a>
                      <a>{item?.InspectorId.fullName}</a>
                    </span>
                    {item?.InspectorId.department &&
                      <span>
                      <a className='font-bold' >Department: </a>

                      <a>{item?.InspectorId.department || item?.InspectorId.userRole}</a>
                      
                    </span>}
                    <span>
                      <a className='font-bold' >Inspected on: </a>
                      <a>{new Date(item?.createdAt).toLocaleString()}</a>
                    </span>

                  </div>
                </div>
                {/* COMMENT */}
                {/* <div className='w-full bg-white px-5 py-3 mb-5 rounded-md' >
                  <Editor editorState={getFormatteComment(item.commentText)} readOnly={true} />
                </div> */}
                <div className='flex flex-row gap-2'>
            <a className="leading-relaxed text-black font-bold text-sm min-w-40">
              Comment:
            </a>
            <div className='w-full bg-white px-5 py-3 mb-5 rounded-md'>
            <Editor editorState={getFormatteComment(item.commentText)} readOnly={true} />
          </div>
          </div>
              </div>
            ))
            )
            :
            (<div className='p-5'>
          No inspection comments yet.
        </div>)
          }
        </div>

      </div>
      {/* COMMENTS */}

      <div className='flex flex-col gap-5 w-full bg-gray-200 px-10 py-5 rounded-md' >
      <InspectionTextEditor />

    </div>
    </div>
  )
}

export default Inspect
