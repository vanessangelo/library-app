import React, { useState } from 'react'

export default function Borrow({ handleBorrow, isDisabled, label }) {
    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = (e) => {
        e.preventDefault();
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
        <>
            <button type="button" disabled={isDisabled} className={`w-full py-2 px-4 ${isDisabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-orange-800 text-white border border-amber-800 hover:bg-amber-950'} rounded-md`} onClick={isDisabled ? null : handleOpenModal}>{label}</button>
            {openModal && (
                <div
                    id="staticModal"
                    tabIndex={-1}
                    aria-hidden="true"
                    className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-opacity-50 bg-gray-900 z-50"
                >
                    <div className="relative w-full max-w-2xl max-h-full mx-3">
                        {/* Modal content */}
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            {/* Modal header */}
                            <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Borrow Book
                                </h3>
                                <button
                                    type="button"
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                    data-modal-hide="staticModal"
                                    onClick={handleCloseModal}
                                >
                                    <svg
                                        className="w-3 h-3"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 14 14"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                        />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            {/* Modal body */}
                            <div className="p-6 space-y-6">
                                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400 text-center mx-auto">
                                    Are you sure you want to borrow the book?
                                </p>
                            </div>
                            {/* Modal footer */}
                            <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                                <button className='bg-white px-4 mr-2 h-10 rounded-lg text-gray-500 border border-gray-400 text-base w-full hover:bg-gray-200' onClick={handleCloseModal} type="button" >
                                    Cancel
                                </button>
                                <button className='bg-amber-800 px-4 mr-2 h-10 rounded-lg text-white border border-amber-800 text-base w-full hover:bg-white hover:text-amber-800' onClick={handleBorrow} type="button" >
                                    Yes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}