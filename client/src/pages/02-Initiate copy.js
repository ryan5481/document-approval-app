import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextEditor from '../components/textEditor/TextEditor'
const baseUrl = process.env.REACT_APP_BASE_URL

function Initiate({ contentInJSON }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  //HANDLE INPUTS
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${baseUrl}/initiate`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json"
        }
      })
      if (res.status == 200) {
        const response = await res.json()

        navigate("/submissions")
      } else {
        console.log("An error occoured.")
      }

    } catch (error) {
      console.log(error)
    }
  };

  return (
    <form onSubmit={handleSubmit} >
      <div className="flex flex-col gap-5 items-center justify-center p-5 mx-20 bg-blue-200" >
        {/* TITLE */}
        <div className="w-full flex flex-col gap-1" >
          <label className="pl-1" >Title</label>
          <input
            id="title"
            name='title'
            required={true}
            value={formData.title}
            onChange={handleChange}
            className="w-full rounded-lg h-10 px-5 focus:outline-blue-400"
          />
        </div>
        {/* FILE UPLOAD */}
        <div className="w-full flex flex-col gap-1" >
          <label className="pl-1" >Upload file</label>
          <input class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none" type="file" />
        </div>
        {/* TEXT EDITOR */}
        <div className="w-full flex flex-col gap-1" >
          <label className="pl-1" >Comment</label>
          <TextEditor
            id="comment"
            name='comment'
            required={true}
            value={formData.comment} 
            // setContentInJSON={contentInJSON}
            onChange={handleChange}
          />
        </div>
        <div>
          <button
            type='submit'
          > Submit</button>
        </div>
      </div>
    </form>
  )
}

export default Initiate