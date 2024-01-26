import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineChevronLeft } from "react-icons/hi";

import Navbar from '../components/NavBar';
import { getOngoingBook, updateIsOngoing } from '../store/reducer/borrowSlice';
import handleCoverError from '../helpers/handleCoverError';
import Borrow from '../components/modal/Borrow';

export default function SingleBookPage() {
    const [bookDetails, setBookDetails] = useState({})
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = localStorage.getItem("token");
    const isOngoing = useSelector((state) => state.borrow.isOngoing);


    const getOneBook = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/books/${id}`);
            if (response.data) {
                const data = response.data.data;
                if (data) {
                    setBookDetails(data);
                } else {
                    setBookDetails({});
                }
            }
        } catch (error) {
            console.warn(error);
        }
    };

    const handleBorrow = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/users/books/${id}/${bookDetails?.volumeInfo?.title}/${bookDetails?.volumeInfo?.authors[0] || "No Author"}/${bookDetails?.volumeInfo?.industryIdentifiers?.[0]?.identifier || "-"}`, {}, { headers: { Authorization: `Bearer ${token}` } });
            if (response.data) {
                const data = response.data.data;
                if (data) {
                    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/ongoing-books`, { headers: { Authorization: `Bearer ${token}` } });
                    if (response.data) {
                        const { data } = response.data;
                        if (Object.keys(data).length !== 0) {
                            dispatch(getOngoingBook(data));
                            dispatch(updateIsOngoing(true));
                            navigate("/history");
                        }
                    }
                }
            }
        } catch (error) {
            console.warn(error);
        }
    }

    useEffect(() => {
        getOneBook()
    }, [token])

    return (
        <div className='w-full min-h-screen flex flex-col bg-slate-100'>
            <Navbar />
            {bookDetails ? (
                <div className='sm:py-4 sm:px-2 flex flex-col sm:flex-row font-inter w-10/12 sm:max-w-4xl mx-auto bg-white h-fit mt-7 rounded-md shadow-lg'>
                    {/* image button back */}
                    <div className='basis-1/3 relative'>
                        <div className="absolute opacity-50"><button type='button' className='grid text-xl sm:text-2xl p-3' onClick={() => navigate(-1)}><HiOutlineChevronLeft size={22} className="rounded-md text-black" style={{ backgroundColor: "rgba(255,255,255,0.8)" }} /></button></div>
                        <img
                            className="w-full h-fit justify-center mx-auto object-cover sm:rounded-lg"
                            src={bookDetails?.volumeInfo?.imageLinks?.thumbnail ? bookDetails?.volumeInfo?.imageLinks?.thumbnail : ""}
                            onError={handleCoverError}
                            alt="/"
                        />
                        <div className='pt-2'>
                            {isOngoing ? (
                                <Borrow handleBorrow={handleBorrow} isDisabled={true} label={"Unable To Borrow"} />
                            ) : (
                                <>
                                 <Borrow handleBorrow={handleBorrow} isDisabled={false} label={"Borrow"} />
                                </>
                            )}
                        </div>
                    </div>
                    <div className='basis-2/3'>
                        <div className='p-4 grid gap-4'>
                            <div className='font-bold text-amber-900'>{bookDetails?.volumeInfo?.title} - {bookDetails?.volumeInfo?.publishedDate ? (bookDetails?.volumeInfo?.publishedDate.slice(0, 4)) : (<span className='font-bold'> - </span>)}</div>
                            <div className='text-sm'> {bookDetails?.volumeInfo?.authors && bookDetails?.volumeInfo?.authors.length > 0 ? (
                                <span>{bookDetails?.volumeInfo?.authors[0].length > 30 ? `by ${bookDetails?.volumeInfo?.authors[0].slice(0, 30)}...` : `by ${bookDetails?.volumeInfo?.authors[0]}`}</span>
                            ) : (
                                <span>No Author</span>
                            )} ||  ISBN: {bookDetails?.volumeInfo?.industryIdentifiers ? (bookDetails?.volumeInfo?.industryIdentifiers[0]?.identifier) : ("-")}</div>
                            <div className='text-sm'>{bookDetails?.volumeInfo?.description ? (bookDetails?.volumeInfo?.description) : ("No description available")}</div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-amber-800 text-center mx-auto px-5">Loading...</div>
            )}
        </div>
    )
}
