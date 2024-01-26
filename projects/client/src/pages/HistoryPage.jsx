import React, { useState, useEffect } from 'react';
import { Pagination } from 'flowbite-react';
import axios from 'axios';
import { useDispatch } from 'react-redux';

import Navbar from '../components/NavBar'
import { removeOngoingBook, updateIsOngoing } from '../store/reducer/borrowSlice';
import Return from '../components/modal/Return';

export default function HistoryPage() {
  const [historyData, setHistoryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  const getHistory = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/borrow-books?page=${currentPage}`, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data) {
        const { data: responseData, pagination } = response.data;
        if (responseData) {
          setHistoryData(responseData.rows);
          setTotalPages(Math.ceil(pagination.totalData / pagination.perPage))
        } else {
          setHistoryData([]);
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const onPageChange = (page) => {
    setHistoryData([]);
    setCurrentPage(page)
  };

  const handleReturn = async (e, bookId) => {
    e.preventDefault()
    try {
      const response = await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/users/borrow-books/${bookId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data) {
        const data = response.data.data;
        dispatch(removeOngoingBook());
        dispatch(updateIsOngoing(false));
        if (data) {
          getHistory()
        }
      }
    } catch (error) {
      console.warn(error);
    }
  }
  useEffect(() => {
    if (token) {
      getHistory()
    }
  }, [currentPage])

  return (
    <>
      <Navbar />
      <div className="flex flex-col text-center p-2 w-9/12 mx-auto mt-10">
        <div className="">
          <div className="grid gap-2">
            <table className="border-collapse border w-full text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4" style={{ width: '30%' }}>Title</th>
                  <th className="py-2 px-4 hidden md:table-cell" style={{ width: '20%' }}>Author</th>
                  <th className="py-2 px-4 hidden md:table-cell" style={{ width: '10%' }}>ISBN</th>
                  <th className="py-2 px-4 hidden md:table-cell" style={{ width: '15%' }}>Borrow Date</th>
                  <th className="py-2 px-4 hidden md:table-cell" style={{ width: '15%' }}>Return Date</th>
                  <th className="py-2 px-4" style={{ width: '10%' }}></th>
                </tr>
              </thead>
              <tbody>
                {historyData.length !== 0 && historyData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-100">
                    <td className="py-2 px-4" style={{ width: '30%' }}>{item?.book_title > 50 ? `${item.book_title.slice(0, 50)}...` : item?.book_title}</td>
                    <td className="py-2 px-4 hidden md:table-cell" style={{ width: '20%' }}>{item?.book_main_author}</td>
                    <td className="py-2 px-4 hidden md:table-cell" style={{ width: '10%' }}>{item?.book_ISBN}</td>
                    <td className="py-2 px-4 hidden md:table-cell" style={{ width: '15%' }}>{item.borrow_date && item.borrow_date.substring(0, 9)}</td>
                    <td className="py-2 px-4 hidden md:table-cell" style={{ width: '15%' }}>{item.return_date ? `${item.return_date.substring(0, 9)}` : `-`}</td>
                    <td className="py-2 px-4" style={{ width: '10%' }}>{item.isBorrow ? <Return bookId={item?.book_id} handleReturn={(e) => handleReturn(e, item?.book_id)} /> : `Returned`}</td>
                  </tr>
                ))}
                {historyData.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-4 text-center">No History Found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className='flex justify-center pb-5 text-sm sm:text-base'>
        <Pagination currentPage={currentPage} onPageChange={onPageChange} showIcons layout="pagination" totalPages={totalPages} nextLabel="Next" previousLabel="Back" className="mx-auto" />
      </div>
    </>
  )
}
