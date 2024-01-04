import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import TextEditor from '../components/textEditor/TextEditor'

function Initiate({contentInJSON}) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({userRole: "user"});

  //HANDLE INPUTS
  const handleChange = (e) => {
    const {name, value} = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  return (
    <div className="flex flex-col gap-5 items-center justify-center p-5 mx-20 bg-blue-200" >
      {/* TITLE */}
      <div className="w-full flex flex-col gap-1" >
        <label className="pl-1" >Title</label>
        <input className="w-full rounded-lg h-10 px-5 focus:outline-blue-400" ></input>
      </div>
      {/* FILE UPLOAD */}
      <div className="w-full flex flex-col gap-1" >
        <label className="pl-1" >Upload file</label>
        <input class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"  type="file" />
      </div>
      {/* TEXT EDITOR */}
      <div className="w-full flex flex-col gap-1" >
        <label className="pl-1" >Comment</label>
        <TextEditor />
      </div>
      <div>
        <button>Submit</button>
      </div>
    </div>
  )
}

export default Initiate