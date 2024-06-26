import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import toast from 'react-simple-toasts';
const baseUrl = process.env.REACT_APP_BASE_URL

const departmentsList = [
  "Dept A",
  "Dept B",
  "Dept C",
  "Dept D",
  "Dept E",
  "Dept F",
]


export default function SignupUserForm() {
  const navigate = useNavigate();
  //PASSWORD VISIBLITY
  const [showPassword, setShowPassword] = useState(false);
  // const [userType, setUserType] = useState('user');
  const [formData, setFormData] = useState({ userRole: "user", department: departmentsList[0] || "Not assigned" });
  const [errorMessage, setErrorMessage] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  //HANDLE INPUTS
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }
  //SUBMIT FORM
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch(`${baseUrl}/signup`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json"
        }
      })
      if (res.status == 200) {
        const response = await res.json()
        navigate("/")
      } else {
        console.log("An error occoured.")
      }

    } catch (error) {
      console.log(error)
      //   toast(errorMessage, { position: 'top-center', theme: 'light' });
    }
  };

  return (
    <main className="flex py-16 justify-center items-center">
      {/* LOGO */}
      <div className='flex flex-col w-80 items-center justify-center bg-white p-5 rounded-lg shadow-lg'>
        <div className='relative flex items-center justify-center h-14 w-80'>
          <img
            src={`/uploads/logo/1.jpeg`}
            height={1000}
            width={1000}
            alt='logo'
            className='absolute rounded-lg h-full w-full object-contain'
          />
        </div>
        {/* TITLE */}
        <div className='flex font-bold text-slate-900 text-[20px] items-center justify-center w-full p-1' >User Regstration Form</div>
        <form
          onSubmit={handleSubmit}
          className="w-full mx-auto"
        >
          {/* USER TYPE */}
          <label htmlFor="userType" className="block text-sm font-medium text-gray-900">User type</label>
          <select
            onChange={handleChange}
            id="userRole"
            name="userRole"
            value={formData.userRole}
            className="bg-gray-50 border border-gray-300 text-gray-900 mb-3 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" >
            <option value="user" >USER</option>
            <option value="initiator">INITIATOR</option>
            <option value="admin" style={{ color: 'red', fontWeight: 'bold' }}>ADMIN</option>
          </select>
          {/* ASSIGN DEPARTMENT FOR normal USER*/}
          {formData.userRole === 'user' && (
            <>
              {/* DEPARTMENT */}
              <label htmlFor="userType" className="block text-sm font-medium text-gray-900">
                Department
              </label>
              <select
                onChange={handleChange}
                id="department"
                name="department"
                value={formData.department}
                className="bg-gray-50 border border-gray-300 text-gray-900 mb-3 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                {departmentsList.map((dept, index) => (
                  <option value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </>
          )}
          {/* NAME */}
          <label htmlFor="email-address-icon" className="block text-sm font-medium text-gray-900">Full name</label>
          <div className="relative  mb-3">
            <div className="absolute inset-y-0 start-0 flex items-center justify-center ps-3.5 pointer-events-none">
              <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
              </svg>
            </div>
            <input
              onChange={handleChange}
              type="text"
              id="fullName"
              name='fullName'
              required={true}
              value={formData.fullName}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 -5  " placeholder="Full Name" />
          </div>

          {/* EMAIL */}
          <label htmlFor="email-address-icon" className="block text-sm font-medium text-gray-900">Email</label>
          <div className="relative  mb-3">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
              </svg>
            </div>
            <input
              onChange={handleChange}
              type="text"
              id="email"
              name='email'
              required={true}
              value={formData.email}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 -5  " placeholder="xyz@radiantit.com" />
          </div>

          {/* PHONE NUMBER */}
          <label htmlFor="email-address-icon" className="block text-sm font-medium text-gray-500">Phone number</label>
          <div className="relative  mb-3">
            <div className="absolute inset-y-0 start-0 flex items-center ps-2.5 pointer-events-none">
              <svg class="w-6 h-6 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M5 4c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4Zm12 12V5H7v11h10Zm-5 1a1 1 0 1 0 0 2 1 1 0 1 0 0-2Z" clip-rule="evenodd" />
              </svg>

            </div>
            <input
              onChange={handleChange}
              type="text"
              id="phoneNumber"
              name='phoneNumber'
              required={true}
              value={formData.phoneNumber}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 -5  " placeholder="9841234567" />
          </div>
          <div className="mb-5">
            {/* PASSWORD */}
            <label htmlFor="password" className="block text-sm font-medium text-gray-900">Password</label>
            <div className="relative">
              <input
                onChange={handleChange}
                type={showPassword ? 'text' : 'password'}
                id="password"
                name='password'
                required={true}
                value={formData.name}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10"
                placeholder="••••••••••••"
              />
              <div
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <svg className="w-4 h-4 text-gray-800 m-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="m2 13.587 3.055-3.055A4.913 4.913 0 0 1 5 10a5.006 5.006 0 0 1 5-5c.178.008.356.026.532.054l1.744-1.744A8.973 8.973 0 0 0 10 3C4.612 3 0 8.336 0 10a6.49 6.49 0 0 0 2 3.587Z" />
                    <path d="m12.7 8.714 6.007-6.007a1 1 0 1 0-1.414-1.414L11.286 7.3a2.98 2.98 0 0 0-.588-.21l-.035-.01a2.981 2.981 0 0 0-3.584 3.583c0 .012.008.022.01.033.05.204.12.401.211.59l-6.007 6.007a1 1 0 1 0 1.414 1.414L8.714 12.7c.189.091.386.162.59.211.011 0 .021.007.033.01a2.981 2.981 0 0 0 3.584-3.584c0-.012-.008-.023-.011-.035a3.05 3.05 0 0 0-.21-.588Z" />
                    <path d="M17.821 6.593 14.964 9.45a4.952 4.952 0 0 1-5.514 5.514L7.665 16.75c.767.165 1.55.25 2.335.251 6.453 0 10-5.258 10-7 0-1.166-1.637-2.874-2.179-3.407Z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-800 m-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
                    <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                  </svg>
                )}
              </div>
            </div>
          </div>
          {/* SUBMIT BUTTON */}
          <div className='flex items-center justify-center' >
            <button
              onClick={handleSubmit}
              type="submit"
              className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >Submit</button>
          </div>
        </form>
      </div>
    </main >
  )
}
