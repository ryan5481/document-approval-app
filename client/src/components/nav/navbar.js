import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { assignUserRole, resetLoginDetails, setLoginDetails } from '../../redux/reducers/userSlice'
import { useNavigate } from 'react-router-dom'
import { TbLogout } from "react-icons/tb";


const Navbar = () => {
    const { isLoggedIn, userRole, email, fullName } = useSelector(state => state.user)
    const dispatch = useDispatch();
    const navigate = useNavigate();


    return (
        <div className='sticky w-full' >
            <nav className="bg-white border-gray-200 dark:bg-gray-900">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <div className='relative flex items-center justify-center mb-2 h-14 w-80'>
                        <img
                            src={`/uploads/logo/1.jpeg`}
                            alt='logo'
                            className='absolute rounded-lg h-full w-full object-contain'
                        />
                    </div>
                    <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                        {/* LOGIN */}
                        {isLoggedIn &&
                            <div className='flex flex-row items-center gap-4 text-white'>
                                <div className='flex flex-col'>
                                    <div className='text-xs' >{fullName}</div>
                                    <a className='text-sm mt-1 text-green-300'>{userRole.replace(/([a-z])([A-Z])/g, '$1 $2').charAt(0).toUpperCase() + userRole.replace(/([a-z])([A-Z])/g, '$1 $2').slice(1)}</a>
                                </div>
                                <div
                                    onClick={() => dispatch(resetLoginDetails())}
                                    className='flex items-center justify-centertext-white  hover:bg-red-500 p-1 h-full rounded-lg cursor-pointer'
                                >
                                    <TbLogout
                                        size={25}
                                    />
                                </div>
                            </div>
                        }


                        <button data-collapse-toggle="navbar-cta" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-cta" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14"> <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" /> </svg>
                        </button>
                    </div>

                    <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-cta">
                        <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                            <li>
                            <a href="/" className="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                                >Home</a>
                            </li>
                            <li>
                                <a href="create-user" className="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                                >Create User</a>
                            </li>
                            <li>
                            <a href="/initiate" className="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                                >Initiate</a>
                            </li>
                            <li>
                                <a href="/submissions" className="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                                >Submissions</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar


// "babel-preset-es2015": "^6.24.1",
// "bcrypt": "^5.1.1",
// "emotion": "^11.0.0",
// "mongodb": "^6.1.0",
// "mongoose": "^7.6.1",
// "next": "13.5.4",
// "next-auth": "^4.23.2",
// "react": "^18",
// "react-dom": "^18",
// "react-icons": "^4.12.0",
// "react-simple-toasts": "^5.10.0",
// "slate-history": "^0.100.0",
// "slate-react": "^0.101.5"