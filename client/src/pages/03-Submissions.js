import React, { useEffect, useState, useRef } from 'react'
import { FaEye } from "react-icons/fa";
import { BiSolidArchiveIn } from "react-icons/bi";
//MODAL CONTENTS
import { Editor, EditorState, convertFromRaw } from 'draft-js';

const baseUrl = process.env.REACT_APP_BASE_URL


function Submissions() {

  //GET DATA ARRAY
  const [submissionsList, setSubmissionsList] = useState([])
  const getSubmissions = async () => {
    try {
      const res = await fetch(`${baseUrl}/get-submissions`, {
        method: "GET",
      });
      if (res.status === 200) {
        const data = await res.json()
        setSubmissionsList(data.foundData)
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
// const contentState = convertFromRaw(JSON.parse(selectedSubmission?.comment));
// const editorState = EditorState.createWithContent(contentState);
// console.log(selectedSubmission?.comment)

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
        >Title</a>
        <a
          className={`p-2 w-48 border-r-[1px] ${textMouseStates.initiatedOn ? clickedBackgroundColor : originalBackgroundColor}`}
          onMouseDown={() => handleMouseDown('initiatedOn')}
          onMouseUp={() => handleMouseUp('initiatedOn')}
        >Initiated on</a>
        <a className={`p-2 w-48 border-r-[1px] ${textMouseStates.inspectedOn ? clickedBackgroundColor : originalBackgroundColor}`}
          onMouseDown={() => handleMouseDown('inspectedOn')}
          onMouseUp={() => handleMouseUp('inspectedOn')}
        >Inspected on</a>
        <a className={`p-2 w-48 border-r-[1px] ${textMouseStates.approved ? clickedBackgroundColor : originalBackgroundColor}`}
          onMouseDown={() => handleMouseDown('approved')}
          onMouseUp={() => handleMouseUp('approved')}
        >Approved</a>
        <a className='p-2 w-16 border-r-[1px]'
          onMouseDown={() => handleMouseDown('initiatedOn')}
          onMouseUp={() => handleMouseUp('initiatedOn')}
        >View</a>
        <a className='p-2 w-16'
          onMouseDown={() => handleMouseDown('initiatedOn')}
          onMouseUp={() => handleMouseUp('initiatedOn')}
        >Archive</a>
      </div>
      {/* DATA LIST */}
      {submissionsList && submissionsList.map((item, index) => (
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
            className='p-2 w-16 flex items-center justify-center border-r-[1px]'
            onClick={() => toggleModalOn(item)}
          ><FaEye /> </div>
          <div className='p-2 w-16 flex items-center justify-center' ><BiSolidArchiveIn /></div>
        </div>
      ))
      }


      {/* BACKDROP */}
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
          className="fixed top-1/2 left-1/2 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative w-full max-w-7xl max-h-full">
            {/* MODAL CONTENT --> */}
            <div className="relative bg-white rounded-lg shadow">
              {/* MODAL HEADER */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                <h3 className="flex items-center justify-center text-xl font-medium text-gray-900 ">
                  Inspect document
                </h3>
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
                <p className="text-base leading-relaxed text-gray-500 ">
                  {selectedSubmission.comment}
                </p>
                {/* <Editor editorState={editorState} readOnly={true} /> */}

              </div>
              {/* MODAL FOOTER */}
              <div className="flex items-center justify-center p-4 md:p-5 space-x-3 rtl:space-x-reverse border-t border-gray-200 rounded-b">
                <button data-modal-hide="extralarge-modal" type="button" className="text-white bg-green-500 hover:bg-green-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Approve</button>
                <button data-modal-hide="extralarge-modal" type="button" className="text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Save Inspection</button>
                <button data-modal-hide="extralarge-modal" type="button" className="ms-3 text-white bg-red-500 hover:bg-red-600  rounded-lg text-sm font-medium px-5 py-2.5 focus:z-10">Reject</button>
              </div>
            </div>
          </div>
        </div>}
    </div>
  )
}

export default Submissions