import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom';
import { FaFilePdf, FaExternalLinkSquareAlt, FaUserCircle, FaNetworkWired } from "react-icons/fa";
import { BsFillCalendarDayFill } from "react-icons/bs";
import { PiSealCheckFill, PiArrowUUpLeftBold, PiUserSquareFill } from "react-icons/pi";
import { AiFillAppstore } from "react-icons/ai";
import axios from 'axios';

import { Editor, EditorState, convertFromRaw } from "draft-js";
import InspectionTextEditor from '../components/inspectionTextEditor/inspectionTextEditor'
const baseUrl = process.env.REACT_APP_BASE_URL


const Inspect = () => {
  const navigate = useNavigate()
  // SHOW HIDE COMMENT BOX
  const [showCommentBox, setShowCommentBox] = useState(false)
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

  // APPROVE OR REJECT
  const { userDbId } = useSelector(state => state.user)

  const updateApprovalState = async (approvalState) => {
    try {
      const response = await axios.put(`${baseUrl}/update-document-status/${id}`,
        {
          state: approvalState,
          operator: userDbId,
          rejectedToAsignee: rejectedToAsignee,
        });
      if (response.status === 200) {
        navigate("/submissions")
      } else {
        console.log("Error")
      }
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  };

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


  // FETCH LIST OF USERS TO ASSIGN TASK TO
  const [usersList, setUsersList] = useState([])
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
  const [selectedDept, setSelectedDept] = useState("")

  const filteredUsers = usersList.filter((user) => user.department === selectedDept);
  const initialAssignedTo = filteredUsers.length > 0 ? filteredUsers[0]._id : "";
  const [rejectedToAsignee, setRejectedToAsignee] = useState(initialAssignedTo);

  // CONFIRM APPROVAL MODAL
  const approveModalRef = useRef(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [dataSelectedForApproval, setDataSelectedForApproval] = useState({});

  const toggleApproveModalOn = (data, updateApprovalState) => {
    if (approveModalRef.current) {
      approveModalRef.current.style.display = 'block';
      setIsApproveModalOpen(true);
      setDataSelectedForApproval(data)
    }
  };

  const toggleApproveModalOff = () => {
    if (approveModalRef.current) {
      approveModalRef.current.style.display = 'none';
      setIsApproveModalOpen(false);
      setDataSelectedForApproval({})
    }
  }

  // CONFIRM REJECT MODAL
  const rejectionModalRef = useRef(null);
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [dataSelectedForRejection, setDataSelectedForRejection] = useState({});

  const toggleRejectionModalOn = (data, updateApprovalState) => {
    if (rejectionModalRef.current) {
      rejectionModalRef.current.style.display = 'block';
      setIsRejectionModalOpen(true);
      setDataSelectedForRejection(data)
    }
  };

  const toggleRejectionModalOff = () => {
    if (rejectionModalRef.current) {
      rejectionModalRef.current.style.display = 'none';
      setIsRejectionModalOpen(false);
      setDataSelectedForRejection({})
    }
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
        <div className='flex flex-col gap-2'>
          {data.comments &&
            data.comments.length > 0 ?
            (
              data.comments.map((item, index) => (
                <div className=''>
                  <div className='flex flex-col py-2 text-xs mb-2'>
                    <div className='flex flex-row gap-5' >
                      <span className='flex items-center justify-center gap-2 text-[18px]'> <PiUserSquareFill size={24} /> <a>{item?.InspectorId.fullName}</a></span>
                      {item?.InspectorId.department &&
                        <span className='flex items-center justify-center gap-2 text-[18px]'> <AiFillAppstore size={22} /> <a>{item?.InspectorId.department || item?.InspectorId.userRole}</a>
                        </span>}
                        <span className='flex items-center justify-center gap-2 text-[18px]'> <BsFillCalendarDayFill /> <a>{new Date(item?.createdAt).toLocaleString()}</a>
                      </span>
                    </div>
                  </div>
                 
                  <div className='flex flex-col'>
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

          {/* APPROVE REJECT BUTTONS */}
          {/* APPROVE REJECT BUTTONS AVAILABLE IF IT'S INSPECTED ONLY */}
          {data.comments && data.comments.length > 0 && data.status[data.status.length - 1].state == "inspected" &&
            <div className="flex flex-row items-center justify-center w-full border-t py-3 border-gray-500">
              {/* <button data-modal-hide="extralarge-modal" type="button" className="text-white bg-green-500 hover:bg-green-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Approve</button> */}
              <button
                onClick={() => toggleApproveModalOn(data)}
                data-modal-hide="extralarge-modal"
                type="button"
                className="w-full text-white bg-green-500 hover:bg-green-600 font-medium rounded-lg text-sm py-2.5 text-center shadow-md"
              >Approve</button>
              <button
                onClick={() => toggleRejectionModalOn(data)}
                data-modal-hide="extralarge-modal"
                type="button"
                className="w-full text-white bg-orange-400 hover:bg-orange-500  rounded-lg text-sm font-medium  py-2.5 focus:z-10 shadow-md"
              >Reject</button>
            </div>}
        </div>

      </div>

      {/* ADD COMMENTS */}
      <div className='flex flex-col gap-5 w-full bg-gray-200 px-10 py-5 rounded-md' >
        <InspectionTextEditor />
      </div>

      {/* ////////////////////// ✅✅✅CONFIRM APPROVAL MODAL✅✅✅  ////////////////////// */}
      {isApproveModalOpen && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-50 z-40"
        // onClick={toggleModalOff}
        ></div>
      )}

      <div
        ref={approveModalRef}
        id="popup-modal"
        tabIndex="-1"
        className="hidden fixed top-0 right-0 bottom-0 left-0 z-50  w-full max-h-full"
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-100">
            <button
              onClick={toggleApproveModalOff}
              type="button"
              className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="popup-modal"
            >
              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <div className="p-4 md:p-5 text-center">
              <div className="flex items-center justify-center">
                <PiSealCheckFill className='text-green-600' size={60} />
              </div>
              <div className='flex flex-col gap-1 p-2'>
                <h3 className="text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to approve this document?</h3>
                <div className='flex flex-row gap-2 items-center justify-center' >
                  <a>Title: </a>
                  <a className='font-bold' >{dataSelectedForApproval.title}</a>
                </div>
              </div>
              <button
                onClick={() => updateApprovalState("approved")}
                data-modal-hide="popup-modal"
                type="button"
                className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2">
                Approve
              </button>
              <button
                onClick={toggleApproveModalOff}
                data-modal-hide="popup-modal"
                type="button"
                className="text-white bg-red-500  hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5focus:z-10"
              >Cancel
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* ////////////////////// 🚫🚫🚫CONFIRM REJECTION MODAL🚫🚫🚫  ////////////////////// */}
      {isRejectionModalOpen && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-50 z-40"
        // onClick={toggleModalOff}
        ></div>
      )}

      <div
        ref={rejectionModalRef}
        id="popup-modal"
        tabIndex="-1"
        className="hidden fixed top-0 right-0 bottom-0 left-0 z-50  w-full max-h-full"
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-100">
            <form>
              <button
                onClick={toggleRejectionModalOff}
                type="button"
                className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="popup-modal"
              >
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="p-4 md:p-5 text-center">
                <div className="flex items-center justify-center">
                  <div className="flex items-center justify-center bg-red-500 w-[60px] h-[60px] rounded-full">
                    <PiArrowUUpLeftBold className='text-white' size={40} />
                  </div>
                </div>
                <div className='flex flex-col gap-2 p-2 px-5'>
                  <h3 className="text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to reject this document?</h3>
                  <div className='flex flex-row gap-2 items-center justify-start' >
                    <a>Title: </a>
                    <a className='font-bold' >{dataSelectedForRejection.title}</a>
                  </div>
                  {/* SELECT USER TO REVERT BACK TO */}
                  <div className='w-full flex justify-start text-sm' ><label>Revert the task to: </label></div>
                  <div className="flex flex-row gap-2 justify-stretch">
                    {/* SELECT DEPARTMENT */}
                    <div className="flex flex-col w-full rounded-xs justify-start">
                      <select
                        required={true}
                        onChange={(e) => setSelectedDept(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 mb-3 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      >
                        {uniqueDepartmentsArray.reverse().map((item, index) => (
                          <option value={item.department}>
                            {item.department}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col w-full rounded-xs justify-start">
                      {/* SELECT USER */}
                      <select
                        required={true}
                        onChange={(e) => setRejectedToAsignee(e.target.value) || filteredUsers[0]?._id}
                        className={`bg-gray-50 border border-gray-300 text-gray-900 mb-3 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder:${filteredUsers[0]?.fullName}`}
                      >
                        {filteredUsers.map((item, index) => (
                          <option value={item._id}>
                            {item.fullName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => updateApprovalState("rejected")}
                  data-modal-hide="popup-modal"
                  type="submit"
                  className="text-white bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2">
                  Reject
                </button>
                <button
                  onClick={toggleRejectionModalOff}
                  data-modal-hide="popup-modal"
                  type="button"
                  className="text-white bg-red-500  hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5focus:z-10"
                >Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>



    </div>
  )
}

export default Inspect
