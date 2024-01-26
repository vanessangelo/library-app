import React, { useState } from 'react';
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import ModalLogout from '../components/modal/LogOut';
import { SiBookstack } from 'react-icons/si';
import { IoMdAlert } from "react-icons/io";

export default function Navbar() {
    const token = localStorage.getItem("token")
    const profile = useSelector((state) => state.auth.profile?.user)
    const isBorrowing = useSelector((state) => state.borrow.isOngoing)
    const location = useLocation()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isAlertOpen, setIsAlertOpen] = useState(false)

    const handleAlertBorrow = () => {
        setIsAlertOpen(!isAlertOpen)
        setTimeout(() => {
            setIsAlertOpen(false);
        }, 3000);
    }

    const handleMenuOpen = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    return (
        <>
            <div className='grid grid-flow-col shadow-lg font-inter bg-yellow-800'>
                <div className='m-4 z-50'>
                    <Link to="/" className='flex w-fit'>
                        <SiBookstack className='text-white text-2xl sm:text-5xl text-center mx-4 cursor-pointer' />
                        <div className='hidden sm:block text-center text-white text-2xl font-bold py-1 cursor-pointer'>LIBRARY</div>
                    </Link>
                </div>
                <div>
                    <div className="h-full w-full flex justify-end gap-6 content-center px-9">
                        {isBorrowing && (
                            <div className='flex items-center text-white text-xl sm:text-2xl cursor-pointer' onClick={handleAlertBorrow}>
                                <IoMdAlert />
                            </div>
                        )}
                        <div className='flex items-center text-white text-base sm:text-xl hover:font-bold cursor-pointer' onClick={handleMenuOpen}>Hi, {profile.name}!</div>
                    </div>
                </div>
            </div>
            {isAlertOpen && (
                <div className='w-full h-full bg-blue-100 font-inter p-2 text-center'>
                    <div>You are currently borrowing a book. Please return it before borrowing another. Thanks!</div>
                    <div><Link to="/history" className="text-base underline hover:text-amber-800">Click here</Link> to return the book.</div>
                </div>
            )}
            {isMenuOpen && (
                <div className='absolute right-0 bg-yellow-800 text-white shadow-lg top-13 sm:top-20 py-4 grid gap-2 z-20'>
                    <div className='flex pl-4 pr-9'>{profile.email}</div>
                    <Link to="/history" className={`flex pl-4 hover:bg-white hover:text-amber-700 hover:font-bold ${location.pathname.includes("/history") ? `font-bold ` : ``}`}>
                        History
                    </Link>
                    <div className='flex pl-4 hover:bg-white hover:text-amber-700 hover:font-bold'>
                        <ModalLogout />
                    </div>
                </div>
            )}
        </>
    );
}
