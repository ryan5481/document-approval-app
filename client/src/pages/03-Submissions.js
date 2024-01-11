import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye } from "react-icons/fa";
import { BiSolidArchiveIn } from "react-icons/bi";
//MODAL CONTENTS
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import { FaFilePdf } from "react-icons/fa";

const baseUrl = process.env.REACT_APP_BASE_URL


function Submissions() {
  const navigate = useNavigate()
  //GET SUBMISSIONS LIST
  const [submissionsList, setSubmissionsList] = useState([])
  const getSubmissions = async () => {
    try {
      const res = await fetch(`${baseUrl}/get-submissions`, {
        method: "GET",
      });
      if (res.status === 200) {
        const data = await res.json()
        setSubmissionsList(data.foundData.reverse())
      }
    } catch {
      console.log("Error")
    }
  }
  useEffect(() => {
    getSubmissions()
  }, [])

  //STYLING
  //CHANGE TABLE HEADER ITEMS BG COLOR ON CLICK
  // Create an object to track the mouse state for each Text element
  const [textMouseStates, setTextMouseStates] = useState({});
  const handleMouseDown = (id) => {
    setTextMouseStates({ ...textMouseStates, [id]: true });
  };
  const handleMouseUp = (id) => {
    setTextMouseStates({ ...textMouseStates, [id]: false });
  };
  const originalBackgroundColor = 'bg-blue-500';
  const clickedBackgroundColor = 'bg-blue-700';

  //DETAIL MODAL
  const modalRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState({});

  const toggleModalOn = (item) => {
    if (modalRef.current) {
      modalRef.current.classList.remove('hidden');
      setIsModalOpen(true);
      setSelectedSubmission(item);
    }
  };

  const toggleModalOff = () => {
    if (modalRef.current) {
      modalRef.current.classList.add('hidden');
      setIsModalOpen(false);
      setSelectedSubmission({});
    }
  };

  //MODAL CONTENTS
  //convert JSON to Draft.js content
  const contentState = selectedSubmission?.instruction
    ? convertFromRaw(JSON.parse(selectedSubmission.instruction))
    : null;

  const editorState = contentState
    ? EditorState.createWithContent(contentState)
    : EditorState.createEmpty();


  return (
    <div className='flex flex-col justify-center items-center  m-5' >
      {/* TABLE HEADER */}
      <div className='w-[1200px] flex flex-cols-5 items-center bg-blue-500 font-bold text-white cursor-pointer' >
        <a
          className='p-2 w-10 border-r-[1px]'
        >SN</a>
        <a
          className={`w-200 p-2 w-96 ${textMouseStates.title ? clickedBackgroundColor : originalBackgroundColor}`}
          onMouseDown={() => handleMouseDown('title')}
          onMouseUp={() => handleMouseUp('title')}
          onMouseLeave={() => handleMouseUp('title')}
        >Title</a>
        <a
          className={`p-2 w-48 border-r-[1px] ${textMouseStates.initiatedOn ? clickedBackgroundColor : originalBackgroundColor}`}
          onMouseDown={() => handleMouseDown('initiatedOn')}
          onMouseUp={() => handleMouseUp('initiatedOn')}
          onMouseLeave={() => handleMouseUp('initiatedOn')}
        >Initiated on</a>
        <a className={`p-2 w-48 border-r-[1px] ${textMouseStates.inspectedOn ? clickedBackgroundColor : originalBackgroundColor}`}
          onMouseDown={() => handleMouseDown('inspectedOn')}
          onMouseUp={() => handleMouseUp('inspectedOn')}
          onMouseLeave={() => handleMouseUp('inspectedOn')}

        >Inspected on</a>
        <a className={`p-2 w-48 border-r-[1px] ${textMouseStates.approved ? clickedBackgroundColor : originalBackgroundColor}`}
          onMouseDown={() => handleMouseDown('approved')}
          onMouseUp={() => handleMouseUp('approved')}
          onMouseLeave={() => handleMouseUp('approved')}

        >Approved</a>
        <a className='p-2 w-16 border-r-[1px]'
        >View</a>
        <a className='p-2 w-16'
        >Archive</a>
      </div>
      {/* DATA LIST */}
      {submissionsList &&
        submissionsList.length > 0 ?
        (submissionsList.map((item, index) => (
          <div
            key={index}
            className='w-[1200px] flex flex-cols-5 items-center bg-white border-b-[1px] border-l-[1px] border-r-[1px] text-sm text-gray-900 cursor-pointer'
          >
            <a className='p-2  w-10 border-r-[1px]' >{index + 1}</a>
            <a className='p-2 w-96 border-r-[1px]' >{item.title}</a>
            <a className='p-2 w-48 border-r-[1px]' >{item.initiatorName}</a>
            <a className='p-2 w-48 border-r-[1px]' >{item?.inspectors?.name}</a>
            <a className='p-2 w-48 border-r-[1px]' >{item?.approved == true ? "Yes" : "No"}</a>
            <div
              className='p-2 w-16 flex items-center justify-center border-r-[1px] group'
              onClick={() => toggleModalOn(item)}
            ><FaEye className='group-hover:text-blue-500' /> </div>
            <div className='p-2 w-16 flex items-center justify-center' ><BiSolidArchiveIn /></div>
          </div>
        )))
        :
        (<div className='p-5'>
          No Data
        </div>)
      }

      {/* MODAL BACKDROP */}
      {isModalOpen && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-50 z-40"
          onClick={toggleModalOff}
        ></div>
      )}

      {/* MODAL */}
      {selectedSubmission &&
        <div
          ref={modalRef}
          id="extralarge-modal"
          tabindex="-1"
          className="fixed top-1/2 left-1/2  z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
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
                <button
                  type="button"
                  className="text-red-500 bg-gray-100 hover:bg-red-500 hover:text-white rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="extralarge-modal"
                  onClick={toggleModalOff}
                >
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              {/* MODAL BODY */}

              <div className="p-4 md:p-5 space-y-4">
                {/* TITLE */}
                <div className='flex flex-row items-center  gap-2'>
                  <a className="leading-relaxed text-black font-bold min-w-40">
                    Case title:
                  </a>
                  <a className="leading-relaxed text-black font-bold">
                    {selectedSubmission.title}
                  </a>
                </div>

                <div className='flex flex-row gap-2'>
                  {/* PDF FILE */}
                  <a className="leading-relaxed text-black font-bold min-w-40">
                    Files uploaded:
                  </a>
                  <div className='fl' >
                    <div
                      onClick={() => window.open(`/uploads/documentPdfs/${selectedSubmission.pdfFile}`, '_blank')}
                      className='flex flex-col items-center justify-center p-1 py-2 bg-white hover:bg-gray-200 rounded-md cursor-pointer group'
                    >
                      <FaFilePdf
                        size={60}
                        className='text-red-500 group-hover:text-red-600'
                      />
                      <a className='text-xs p-1 text-gray-700 group-hover:text-black' >
                        {selectedSubmission.fileTitle}
                      </a>
                    </div>
                  </div>
                </div>
                <div className='flex flex-row gap-2'>
                  <a className="leading-relaxed text-black font-bold min-w-40">
                    Instruction:
                  </a>
                  <Editor editorState={editorState} readOnly={true} />
                </div>
              </div>
              {/* INITIATION DETAILS */}
              <div className='flex flex-col border-t border-gray-200 p-5'>
                <div className='flex flex-row gap-5' >
                  <a>Initiated by: {selectedSubmission.initiatorName}</a>
                  <a>Initiated on: {new Date(selectedSubmission.createdAt).toLocaleString()}</a>
                  <a>First assigned to: {selectedSubmission.firstAssigneeName}</a>
                </div>
              </div>
              {/* MODAL FOOTER */}
              <div className="flex items-center justify-center p-4 md:p-5 space-x-3 rtl:space-x-reverse border-t border-gray-200 rounded-b">
                {/* <button data-modal-hide="extralarge-modal" type="button" className="text-white bg-green-500 hover:bg-green-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Approve</button> */}
                <button
                  onClick={() => navigate(`/inspect/${selectedSubmission._id}`)}
                  data-modal-hide="extralarge-modal" type="button" className="text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >Inspect</button>
                <button
                  data-modal-hide="extralarge-modal" type="button" className="ms-3 text-white bg-red-500 hover:bg-red-600  rounded-lg text-sm font-medium px-5 py-2.5 focus:z-10"
                >Close</button>
              </div>
            </div>
          </div>
        </div>}
    </div>
  )
}

export default Submissions