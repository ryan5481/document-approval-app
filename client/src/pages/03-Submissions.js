import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { FaEye } from "react-icons/fa";
import { BiSolidArchiveIn } from "react-icons/bi";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { useSelector } from 'react-redux'
//MODAL CONTENTS
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import { FaFilePdf, FaUserCircle } from "react-icons/fa";
import { MdRocketLaunch } from "react-icons/md";
import { BsFillCalendarDayFill } from "react-icons/bs";
import { BsPatchCheckFill } from "react-icons/bs";
import { GrRevert } from "react-icons/gr";
import { PiClipboardTextFill } from "react-icons/pi";
import { AiFillAppstore } from "react-icons/ai";

const baseUrl = process.env.REACT_APP_BASE_URL
const itemsPerPage = 10;

function Submissions() {
  const { userRole, userDept } = useSelector(state => state.user)
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
        setSubmissionsList(data.foundData)
      }
    } catch {
      console.log("Error")
    }
  }
  useEffect(() => {
    getSubmissions()
  }, [])

  //If userRole === "user", DISPLAY LIST ASSIGNED TO logged in user's department only 
  const filteredSubmissionsListByUserRole = userRole === 'user'
    ? submissionsList.filter(item => item.firstAssigneeDept === userDept)
    : submissionsList;

  ////// FILTER DATA BY STATUS  ////// 
  const [selectedDataType, setSelectedDataType] = useState("all")
  const handleItemClick = (dataType) => {
    setSelectedDataType(dataType);
  };

  const getBackgroundColor = (dataType) => {
    return selectedDataType === dataType ? "bg-blue-600 text-white" : "bg-white text-gray-900";
  };
  const filteredSubmissionsListByStatus = (selectedDataType === "all")
    ? filteredSubmissionsListByUserRole
    : filteredSubmissionsListByUserRole.filter(item => {
      // Check if the item has a "status" array and it's not empty
      if (item.status && item.status.length >= 0) {
        // Get the last object in the "status" array
        const lastStatus = item.status[item.status.length - 1];

        // Check if the last "state" matches the selectedDataType
        return lastStatus.state === selectedDataType;
      }

      // If the item doesn't have a "status" array or it's empty, exclude it
      return false;
    });

  //COLUMN HEADING STYLING
  //CHANGE TABLE HEADER ITEMS BG COLOR ON CLICK
  // Create an object to track the mouse state for each Text element
  const [textMouseStates, setTextMouseStates] = useState({});
  const handleMouseDown = (id) => {
    setTextMouseStates({ ...textMouseStates, [id]: true });
  };
  const handleMouseUp = (id) => {
    setTextMouseStates({ ...textMouseStates, [id]: false });
  };
  const originalBackgroundColor = 'bg-blue-600';
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

  // SORTING
  const [sortColumn, setSortColumn] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  // Arrow direction state
  const [arrowDirection, setArrowDirection] = useState('down');

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }

    // Toggle arrow direction
    setArrowDirection((prevDirection) => (prevDirection === 'down' ? 'up' : 'down'));
  };

  //convert COMMENTS JSON to Draft.js content
  const commentContentState = selectedSubmission?.comments?.commentText
    ? convertFromRaw(JSON.parse(selectedSubmission?.comments?.commentText))
    : null;
  const commentPreviewState = commentContentState
    ? EditorState.createWithContent(commentContentState)
    : EditorState.createEmpty();

  //convert COMMENTS JSON to Draft.js content
  const getFormattedComment = (unformattedJSON) => {
    const commentState = unformattedJSON
      ? convertFromRaw(JSON.parse(unformattedJSON))
      : null;
    const commentPreviewState = commentState
      ? EditorState.createWithContent(commentState)
      : EditorState.createEmpty();
    return commentPreviewState
  }

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredSubmissionsListByStatus.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Sorting logic
  const sortedList = [...filteredSubmissionsListByStatus].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const paginatedList = sortedList.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className=' flex flex-col items-center justify-start bg-slate-700 border-b border-gray-200 min-h-screen'>
      {/* ////// FILTER DATA BY STATUS  ////// */}
      <ul className="flex flex-row text-md font-medium text-center text-gray-500 rounded-lg shadow w-[1200px] mt-5">
        <li className="w-full">
          <a
            onClick={() => handleItemClick("all")}
            className={`inline-block w-full p-4 text-gray-900 hover:text-white hover:bg-blue-500 border-r border-gray-200 rounded-s-lg ${getBackgroundColor("all")}`}
          >All</a>
        </li>
        <li className="w-full">
          <a
            onClick={() => handleItemClick("all")}
            className={`inline-block w-full p-4 text-gray-900 hover:text-white hover:bg-blue-500 border-r border-gray-200  ${getBackgroundColor("initiated")}`}
          >Initiated</a>
        </li>
        <li className="w-full">
          <a
            onClick={() => handleItemClick("inspected")}
            className={`inline-block w-full p-4 hover:text-white hover:bg-blue-500 border-r border-gray-200 ${getBackgroundColor("inspected")}`}
          >Inspected</a>
        </li>
        <li className="w-full">
          <a
            onClick={() => handleItemClick("approved")}
            className={`inline-block w-full p-4 hover:text-white hover:bg-blue-500 border-r border-gray-200 ${getBackgroundColor("approved")}`}
          >Approved</a>
        </li>
        <li className="w-full">
          <a
            onClick={() => handleItemClick("rejected")}
            className={`inline-block w-full p-4 hover:text-white hover:bg-blue-500 border-s-0 border-gray-200 rounded-e-lg ${getBackgroundColor("rejected")}`}
          >Rejected</a>
        </li>
      </ul>

      {/* DATA DIEPLAY */}
      <div className="p-2">
        {/* <div className='flex flex-col items-center justify-center text-white text-[18px] font-bold' >
          {(userRole === "admin" || userRole === "superAdmin" || userRole === "initiator") ?
            ("All Tasks") : (`Tasks Assigned To ${userDept} Department`)}
        </div> */}
        <div className={`relative flex flex-col justify-top items-center p-5 min-h-[600px] w-full
          ${(userRole === "admin" || userRole === "superAdmin" || userRole === "initiator") ? ("flex-cols-7") : ("flex-cols-6")}`} >

          {/* TABLE HEADER */}
          {paginatedList.length > 0 &&
            <div className={`w-[1200px] flex  items-center bg-blue-600 font-bold text-white rounded-t-lg cursor-pointer`} >
              <a
                className='p-2 w-10 border-r-[1px]'
              >SN</a>
              <a
                className={`flex items-center justify-between w-200 p-2 w-96 border-r-[1px] ${sortColumn === 'title' ? clickedBackgroundColor : originalBackgroundColor}`}
                onMouseDown={() => handleMouseDown('title')}
                onMouseUp={() => handleMouseUp('title')}
                onMouseLeave={() => handleMouseUp('title')}
                onClick={() => handleSort('title')}
              >
                <span>Title</span>
                {sortColumn === 'title' && (arrowDirection === 'down' ? <IoMdArrowDropdown /> : <IoMdArrowDropup />)}
              </a>
              <a
                className={`flex items-center justify-between p-2 w-48 border-r-[1px] ${textMouseStates.initiatedOn ? clickedBackgroundColor : originalBackgroundColor}`}
                onMouseDown={() => handleMouseDown('initiatedOn')}
                onMouseUp={() => handleMouseUp('initiatedOn')}
                onMouseLeave={() => handleMouseUp('initiatedOn')}
                onClick={() => handleSort('createdAt')}
              >
                <span>Initiated On</span>
                {sortColumn === 'createdAt' && (arrowDirection === 'down' ? <IoMdArrowDropdown /> : <IoMdArrowDropup />)}
              </a>
              <a className={`flex items-center justify-between p-2 w-48 border-r-[1px] ${textMouseStates.inspectedOn ? clickedBackgroundColor : originalBackgroundColor}`}
                onMouseDown={() => handleMouseDown('inspectedOn')}
                onMouseUp={() => handleMouseUp('inspectedOn')}
                onMouseLeave={() => handleMouseUp('inspectedOn')}
                onClick={() => handleSort('comments.createdOn')}
              >
                <span>Inspected On</span>
                {sortColumn === 'comments?.CreatedAt' && (arrowDirection === 'down' ? <IoMdArrowDropdown /> : <IoMdArrowDropup />)}
              </a>
              <a className={`flex items-center justify-between p-2 w-48 border-r-[1px] ${textMouseStates.approved ? clickedBackgroundColor : originalBackgroundColor}`}
                onMouseDown={() => handleMouseDown('approved')}
                onMouseUp={() => handleMouseUp('approved')}
                onMouseLeave={() => handleMouseUp('approved')}
                onClick={() => handleSort('approved')}
              >
                <span>Approved</span>
                {sortColumn === 'approved' && (arrowDirection === 'down' ? <IoMdArrowDropdown /> : <IoMdArrowDropup />)}
              </a>
              <a className={`p-2 w-16 ${(userRole === "admin" || userRole === "superAdmin" || userRole === "initiator") ? ("border-r-[1px]") : (null)}`}
              >View</a>
              {/* SHOW ARCHIVE BUTTON TO ADMINS AND INITIATOR ONLY */}
              {(userRole === "admin" || userRole === "superAdmin" || userRole === "initiator") &&
                <a className='p-2 w-16'
                >Archive</a>}
            </div>}

          {/* DATA LIST */}
          {paginatedList &&
            paginatedList.length > 0 ? (
            paginatedList.map((item, index) => (
              <div
                key={index}
                className={`w-[1200px] flex flex-cols-5 items-center bg-white border-b-[1px] border-l-[1px] border-r-[1px] text-sm text-gray-900 cursor-pointer hover:text-blue-500 
              ${index === paginatedList.length - 1 ? 'rounded-b-lg' : ''}`}
              >
                <a className='flex items-center justify-center p-2 w-10 border-r-[1px]' >{index + 1}</a>
                <a className='p-2 w-96 border-r-[1px]' >{item.title}</a>
                <a className='p-2 w-48 border-r-[1px]' >{new Date(item.createdAt).toLocaleString()}</a>
                <a className='p-2 w-48 border-r-[1px]' >{item?.inspectors?.name}</a>
                <a className='p-2 w-48 border-r-[1px]' >{item?.approved == true ? "Yes" : "No"}</a>
                <div
                  className={`p-2 w-16 flex items-center justify-center group ${(userRole === "admin" || userRole === "superAdmin" || userRole === "initiator") ? ("border-r-[1px]") : (null)}`}
                  onClick={() => toggleModalOn(item)}
                ><FaEye className='group-hover:text-green-500' /> </div>
                {/* SHOW ARCHIVE BUTTON TO ADMINS AND INITIATOR ONLY */}
                {(userRole === "admin" || userRole === "superAdmin" || userRole === "initiator") &&
                  <div className='p-2 w-16 flex items-center justify-center' ><BiSolidArchiveIn /></div>
                }
              </div>
            ))
          )
            :
            (<div className='p-5 text-white'>
              No Data.
            </div>)
          }

          {/* /////////////////////////////////////////////////////// MODAL MODAL MODAL ////////////////////////////////////////////////////////////// */}

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
                <div className="relative flex flex-col gap-0 bg-white rounded-lg shadow p-5">
                  {/* MODAL HEADER */}
                  <div className="flex items-center justify-between p-4 border-b rounded-t">
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
                  {/* STEPPER   STEPPER  STEPPER   STEPPER  STEPPER   STEPPER  STEPPER   STEPPER  STEPPER   STEPPER  STEPPER   STEPPER  */}

                  <ol className="relative text-gray-500 border-s-2 border-blue-500 mt-5 mx-10">
                    <li className="mb-10 ms-6">
                      <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full -start-4 ring-4 ring-white ">
                        <MdRocketLaunch color='white' />
                      </span>
                      <div className='flex flex-col gap-3 rounded-md px-5 py-2 pb-5 bg-gray-100 '>
                        {/* TITLE */}
                        <div className='flex flex-row items-center justify-between' >
                          <a className="leading-relaxed text-black font-bold">
                            {selectedSubmission.title}
                          </a>
                          {selectedSubmission && selectedSubmission.status && selectedSubmission.status[selectedSubmission.status.length - 1].state == "initiated" &&
                            <span>Status: <a className='text-blue-500' >Initiated</a></span>}
                          {selectedSubmission && selectedSubmission.status && selectedSubmission.status[selectedSubmission.status.length - 1].state == "inspected" &&
                            <span>Status: <a className='text-blue-500' >Inspected</a></span>}
                          {selectedSubmission && selectedSubmission.status && selectedSubmission.status[selectedSubmission.status.length - 1].state == "approved" &&
                            <span>Status: <a className='text-green-500' >Approved</a></span>}
                          {selectedSubmission && selectedSubmission.status && selectedSubmission.status[selectedSubmission.status.length - 1].state == "rejected" &&
                            <span>Status: <a className='text-red-500' >Rejected</a></span>}
                        </div>

                        <div className='flex flex-row gap-2'>
                          {/* PDF FILE */}

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
                        <div className='flex flex-row gap-2 bg-white p-5 rounded-md'>
                          <Editor editorState={editorState} readOnly={true} />
                        </div>
                        {/* INITIATION DETAILS */}
                        <div className='flex flex-col'>
                          <div className='flex flex-row gap-5' >
                            <a>Initiated by: {selectedSubmission.initiatorName}</a>
                            <a>Initiated on: {new Date(selectedSubmission.createdAt).toLocaleString()}</a>
                            <a>First assigned to: {selectedSubmission.firstAssigneeDept}, {selectedSubmission.firstAssigneeName}</a>
                          </div>
                        </div>
                      </div>

                    </li>

                    {/* //////// COMMENTS ////////// */}

                    {selectedSubmission.comments &&
                      selectedSubmission.comments.length >= 0 ?
                      (
                        selectedSubmission.comments.map((item, index) => (
                          <li className="mb-10 ms-6">
                            <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full -start-4 ring-4 ring-white ">
                              <PiClipboardTextFill color='white' />
                            </span>
                            <div className='bg-gray-100 px-5 rounded-md'>
                              <div className='flex flex-col py-2 text-xs mb-2'>
                                <div className='flex flex-row gap-5' >
                                  <span className='flex items-center justify-center gap-2 text-[14px]'> <FaUserCircle  /> <a>{item?.InspectorId.fullName}</a></span>
                                  {item?.InspectorId.department &&
                                    <span className='flex items-center justify-center gap-2 text-[14px]'> <AiFillAppstore  /> <a>{item?.InspectorId.department || item?.InspectorId.userRole}</a>
                                    </span>}
                                  {/* <a>{new Date(item?.createdAt).toLocaleString()}</a> */}
                                  <span className='flex items-center justify-center gap-2 text-[18px]'> <BsFillCalendarDayFill /> <a>{new Date(item?.createdAt).toLocaleString()}</a>
                                  </span>

                                </div>
                              </div>
                              {/* COMMENT */}
                              <div className='flex flex-col'>
                                <div className='w-full bg-white px-5 py-3 mb-5 rounded-md'>
                                  <Editor editorState={getFormattedComment(item.commentText)} readOnly={true} />
                                </div>
                              </div>
                            </div>

                          </li>

                        ))
                      )
                      :
                      (<div className='p-5 mb-5 ml-5 bg-gray-100 rounded-md'>
                        No inspection comments yet.
                      </div>)
                    }
                  </ol>

                  {selectedSubmission && selectedSubmission.status && selectedSubmission.status[selectedSubmission.status.length - 1].state == "approved" &&
                    <ol className="relative text-gray-500 mb-5 mx-10">
                      <li className="mb-10 ms-6">
                        <BsPatchCheckFill size={30} className="absolute flex items-center justify-center text-green-500 bg-white  w-8 h-8rounded-full -start-4 ring-4 ring-white " />
                        <h3 className="text-xl text-green-500 font-bold leading-tight">Aproved</h3>
                        <p className="text-sm">Approved by: {selectedSubmission.status[selectedSubmission.status.length - 1].operatorName}</p>
                        <p className="text-sm">Approved on: {new Date(selectedSubmission.status[selectedSubmission.status.length - 1].createdAt).toLocaleString()} </p> 
                      </li>
                    </ol>
                  }

                  {selectedSubmission && selectedSubmission.status && selectedSubmission.status[selectedSubmission.status.length - 1].state == "rejected" &&
                    <ol className="relative text-gray-500 mb-5 mx-10">
                      <li className="mb-10 ms-6">
                        <span className="absolute flex items-center justify-center w-8 h-8 bg-red-500 rounded-full -start-4 ring-4 ring-white ">
                          <GrRevert color='white' size={20} />
                        </span>
                        <h3 className="text-xl text-red-500 font-bold leading-tight">Rejected</h3>
                        <p className="text-sm">Rejected by: {selectedSubmission.status[selectedSubmission.status.length - 1].operatorName}</p>
                        <p className="text-sm">Rejected on: {new Date(selectedSubmission.status[selectedSubmission.status.length - 1].createdAt).toLocaleString()} </p> 
                        <p className="text-sm">Reverted to: {selectedSubmission.status[selectedSubmission.status.length - 1].operatorName}</p>
                      </li>
                    </ol>
                  }


                  {/* MODAL FOOTER */}
                  {selectedSubmission.comments && selectedSubmission.comments.length >= 0 && (selectedSubmission.status[selectedSubmission.status.length - 1].state == "inspected" || selectedSubmission.status[selectedSubmission.status.length - 1].state == "initiated") &&
                    <div className="flex items-center w-full justify-center space-x-3 rounded-b">
                      {/* <button data-modal-hide="extralarge-modal" type="button" className="text-white bg-green-500 hover:bg-green-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Approve</button> */}
                      <button
                        onClick={() => navigate(`/inspect/${selectedSubmission._id}`)}
                        data-modal-hide="extralarge-modal" type="button" className="text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                      >Inspect</button>
                      <button
                      onClick={toggleModalOff}
                        data-modal-hide="extralarge-modal" type="button" className="ms-3 text-white bg-red-500 hover:bg-red-600  rounded-lg text-sm font-medium px-5 py-2.5 focus:z-10"
                      >Close</button>
                    </div>}
                </div>
              </div>
            </div>}
          {/* PAGINATION */}
          {paginatedList.length > 0 &&
            <div className='absolute bottom-0 inline-flex m-2'>
              <button
                className={`flex items-center justify-center min-w-32 text-white bg-blue-600 hover:bg-blue-700 px-5 rounded-l-full rounded-r-sm ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={`flex items-center justify-center min-w-10 text-white  hover:bg-blue-700 rounded-sm ${currentPage === i + 1 ? 'bg-blue-500' : 'bg-blue-600'
                    }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className={`flex items-center justify-center min-w-32 text-white bg-blue-600 hover:bg-blue-700 px-5 rounded-r-full rounded-l-sm ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>}
        </div>
      </div>
    </div>
  )
}

export default Submissions