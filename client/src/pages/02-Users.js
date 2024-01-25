import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASE_URL

function Users() {

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

  return (
    <div className=' flex flex-col items-center justify-start text-sm bg-slate-700  border-gray-200 min-h-screen'>
      <div className={`w-[1200px] flex my-5 items-center bg-blue-500 font-bold text-white rounded-t-lg cursor-pointer`} >
        <a
          className='p-2 w-10 border-r-[1px]'
        >SN</a>
        <a
          className={`flex items-center justify-between w-200 p-2 w-96 border-r-[1px]`}

        >
          <span>Name</span>
        </a>
        <a
          className={`flex items-center justify-between p-2 w-48 border-r-[1px] `}

        >
          <span>Designation</span>
        </a>
        <a className={`flex items-center justify-between p-2 w-48 border-r-[1px] `}

        >
          <span>Department</span>
        </a>
        <a className={`flex items-center justify-between p-2 w-48 border-r-[1px]`}

        >
          <span>Email</span>
        </a>
        <a className={`flex items-center justify-between p-2 w-48 border-r-[1px]`}
        >Phone Number</a>
        <a className={`flex items-center justify-between p-2 w-16 border-r-[1px]`}
        >View</a>
        <a className='p-2 w-16'
        >Delete</a>
      </div>
    </div>
  )
}

export default Users