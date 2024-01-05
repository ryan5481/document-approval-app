import React, { useEffect, useState } from 'react'
const baseUrl = process.env.REACT_APP_BASE_URL

function Submissions() {
const [submissionsList, setSubmissionsList] = useState([])

  const getSubmissions = async() => {
    try{
      const res = await fetch(`${baseUrl}/get-submissions`, {
        method: "GET",
      });
      if(res.status === 200){
        const data = await res.json()
        setSubmissionsList(data.foundData)
      }
    }catch{
      console.log("Error")
    }
  }

  console.log(submissionsList)

  useEffect(() =>{
    getSubmissions()
  }, [])
  return (
    <div className='flex flex-col justify-center items-center w-full m-5' >
      <div className='w-[1000px] flex flex-cols-5 gap-2 mx-5 items-center bg-blue-500 font-bold text-white cursor-pointer' >
        <a className='p-2 w-10 border-r-[1px]' >SN</a>
        <a className='p-2 w-64 border-r-[1px]' >Title</a>
        <a className='p-2 w-40 border-r-[1px]' >Initiation</a>
        <a className='p-2 w-40 border-r-[1px]' >Inspection</a>
        <a className='p-2 w-40 border-r-[1px]' >Approval</a>
        <a className='p-2 w-20 border-r-[1px]' >View</a>
        <a className='p-2 w-20' >Archive</a>
      </div>
      <div className='w-[1000px] flex flex-cols-5 gap-2 mx-5 items-center bg-white border-b-[1px] border-l-[1px] border-r-[1px] text-gray-900 cursor-pointer' >
        <a className='p-2  w-10 border-r-[1px]' >1</a>
        <a className='p-2 w-64 border-r-[1px]' >Title</a>
        <a className='p-2 w-40 border-r-[1px]' >Initiation</a>
        <a className='p-2 w-40 border-r-[1px]' >Inspection</a>
        <a className='p-2 w-40 border-r-[1px]' >Approval</a>
        <a className='p-2 w-20 border-r-[1px]' >View</a>
        <a className='p-2 w-20' >Archive</a>

      </div>

    </div>
  )
}

export default Submissions