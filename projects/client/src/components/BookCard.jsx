import React from 'react';
import { Link, useNavigate } from 'react-router-dom'
import handleCoverError from '../helpers/handleCoverError';

export default function BookCard({bookData}) {
  return (
    <div className='w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 sm:gap-1 pb-10 justify-center'>
        {bookData.length !== 0 && bookData.map((item) => (
          <div className="w-[250px] sm:w-[250px] h-[450px] m-2 rounded-lg shadow-lg font-inter mx-auto bg-white">
            <Link to={`/single-book/${item.id}`}>
              <div className="relative">
                <div className="absolute bottom-0 left-0 w-full h-8 bg-amber-700 z-10 flex justify-center text-sm items-center text-white font-inter">{item?.volumeInfo?.categories ? item?.volumeInfo?.categories : "Not Categorized"}</div>
                <img
                  className="w-[250px] h-[300px] object-cover rounded-t-lg"
                  src={item?.volumeInfo?.imageLinks?.thumbnail ? item?.volumeInfo?.imageLinks?.thumbnail : ""}
                  alt="Cover Image"
                  onError={handleCoverError}
                />
              </div>
              <div className="grid grid-rows-2 w-full h-[150px]">
                <div className="flex flex-col font-semibold text-base my-1 mx-2 justify-center content-center text-center">
                  {item?.volumeInfo?.title.length > 55
                    ? `${item.volumeInfo.title.slice(0, 55)}...`
                    : item?.volumeInfo?.title}
                </div>
                <div className="flex flex-col text-sm my-1 mx-2 justify-center content-center h-full text-center">
                  {item?.volumeInfo?.authors && item.volumeInfo?.authors.length > 0 ? (
                    <span>{item.volumeInfo?.authors[0].length > 30 ? `${item.volumeInfo?.authors[0].slice(0, 30)}...` : item?.volumeInfo?.authors[0]}</span>
                  ): (
                    <span>No Author</span>
                  )} 
                  <span className='font-bold'>{item?.volumeInfo?.publishedDate ? (item?.volumeInfo?.publishedDate.slice(0, 4)) : (<span className='font-bold'> - </span>)}</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
  )
}
