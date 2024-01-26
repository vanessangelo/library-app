import React, { useState } from 'react'
import library from '../assets/Library-2.jpg'

export default function Search({ isSearched, value, onSubmit }) {
    const [searchValue, setSearchValue] = useState(value)

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(searchValue)
    }
    return (
        <div className={`relative grid content-evenly mx-auto w-screen font-inter ${isSearched ? `h-52 sm:h-96` : "h-screen"}`} style={{
            backgroundImage: `url(${library})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
        }}>
            <div className="h-full w-full bg-black absolute top-0 left-0" style={{ opacity: 0.4 }}></div>
            <div className='text-white font-bold text-4xl text-center z-10'>Explore Here!</div>
            <form onSubmit={handleSubmit} className='relative mx-4 md:mx-36 lg:mx-72'>
                <input value={searchValue} type="text" onChange={(e) => setSearchValue(e.target.value)} placeholder='Search here...' className='h-10 border-none w-full bg-white rounded-md p-2 pl-4 pr-10 focus:outline-none shadow-md focus:ring-0' />
                <button
                    type="submit"
                    className="absolute right-3 top-2.5 h-5 w-5 text-amber-800 font-bold"
                >
                    <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-5.2-5.2"
                        />
                    </svg>
                </button>
            </form>
        </div>
    )
}
