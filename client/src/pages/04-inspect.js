import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Editor, EditorState, convertFromRaw } from 'draft-js';

import { FaFilePdf } from "react-icons/fa";

const baseUrl = process.env.REACT_APP_BASE_URL


const Inspect = () => {
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

const editorState = contentState
  ? EditorState.createWithContent(contentState)
  : EditorState.createEmpty();

  return (
    <div>
      {data &&
        <div
          tabindex="-1"
          className="fixed top-1/2 left-1/2  z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto  max-h-full"
        >
          <div className="relative w-full max-w-7xl max-h-full">
            {/* MODAL CONTENT --> */}
            <div className="relative bg-white rounded-lg shadow px-5">
              {/* MODAL HEADER */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                <div className='w-full flex items-center justify-center' >
                <h3 className="flex items-center justify-center text-xl font-medium text-gray-900 ">
                  View case
                </h3>
                </div>
                
              </div>
              {/* MODAL BODY */}

              <div className="p-4 md:p-5 space-y-4">
                {/* TITLE */}
                <div className='flex flex-row items-center  gap-2'>
                  <a className="leading-relaxed text-black font-bold min-w-40">
                    Case title:
                  </a>
                  <a className="leading-relaxed text-black font-bold">
                    {data.title}
                  </a>
                </div>

                {/* PDF FILES */}
                <div className='flex flex-row gap-2'>
                  {/* PDF FILE */}
                  <a className="leading-relaxed text-black font-bold min-w-40">
                    Files uploaded:
                  </a>
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
                <div className='flex flex-row gap-2'>
                <a className="leading-relaxed text-black font-bold min-w-40">
                    Files uploaded:
                  </a>
                  {/* <Editor editorState={editorState} readOnly={true} /> */}
                </div>
              </div>
              {/* INITIATION DETAILS */}
              <div className='flex flex-col border-t border-gray-200 p-5'>
                <div className='flex flex-row gap-5' >
                  <a>Initiated by: {data.initiatorName}</a>
                  <a>Initiated on: {new Date(data.createdAt).toLocaleString()}</a>
                  <a>First assigned to: {data.firstAssigneeName}</a>
                </div>
              </div>
              {/* MODAL FOOTER */}
             
            </div>
          </div>
        </div>}
    </div>
  )
}


export default Inspect

