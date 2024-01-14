import React from 'react'
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { resetLoginDetails } from '../../redux/reducers/userSlice'
import { TbLogout } from "react-icons/tb";

const Navbar = () => {
    const { isLoggedIn, userRole, fullName } = useSelector(state => state.user)
    const dispatch = useDispatch();
    const location = useLocation();

    let menuItems = []
    if (userRole === 'superAdmin') {
        menuItems = [
            {
                label: "Home",
                href: "/",
            },
            {
                label: "Users",
                href: "/create-user",
            },
            {
                label: "Initiate",
                href: "/initiate",
            },
            {
                label: "Submissions",
                href: "/submissions",
            },
            {
                label: "Settings",
                href: "/settings",
            },
        ]
    } else if (userRole === 'admin') {
        menuItems = [
            {
                label: "Home",
                href: "/",
            },
            {
                label: "Users",
                href: "/create-user",
            },
            {
                label: "Initiate",
                href: "/initiate",
            },
            {
                label: "Submissions",
                href: "/submissions",
            },
        ]
    } else if (userRole === 'initiator') {
        menuItems = [
            {
                label: "Home",
                href: "/",
            },
            {
                label: "Initiate",
                href: "/initiate",
            },
            {
                label: "Submissions",
                href: "/submissions",
            },
        ]
    } else if (userRole === 'user') {
        menuItems = [
            {
                label: "Home",
                href: "/",
            },
            {
                label: "Submissions",
                href: "/submissions",
            },
        ]
    } 

    return (
        <div className='sticky w-full' >
            <nav className="bg-white border-gray-200 dark:bg-gray-900">
                <div className="max-w-screen-xl flex flex-end items-center justify-between mx-auto p-2">
                    <div className='relative flex items-center justify-center  h-14 w-80 '>
                        <img
                            src={`/uploads/logo/1.jpeg`}
                            alt='logo'
                            className='absolute rounded-lg h-full w-full object-contain'
                        />
                    </div>
                    <div className="flex w-80 md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                        {/* LOGIN */}
                        {isLoggedIn &&
                            <div className='flex flex-row items-center gap-4 text-white'>
                                <div className='flex flex-col'>
                                    <div className='text-xs' >{fullName}</div>
                                    <a className='mt-1 text-green-500 text-sm font-bold'>{userRole.replace(/([a-z])([A-Z])/g, '$1 $2').charAt(0).toUpperCase() + userRole.replace(/([a-z])([A-Z])/g, '$1 $2').slice(1)}</a>
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

                    <div className="items-center justify-between hidden text-md w-full md:flex md:w-auto md:order-1" id="navbar-cta">
                        <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                            {menuItems.map ((item, index) => (
                            (<li key={index} className='flex min-w-12'>
                                <a href={`${item.href}`} className={`block py-2 px-3 md:p-0 ${location.pathname === item.href ? 'text-blue-500' : 'text-white'} rounded hover:text-blue-300 `}
                                >{item.label}</a>
                            </li>)
                            ))}
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar
