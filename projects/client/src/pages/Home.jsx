import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Navbar from '../components/NavBar';
import Search from '../components/Search';
import BookCard from '../components/BookCard';

export default function Home() {
  const [filter, setFilter] = useState(new URLSearchParams());
  const [bookData, setBookData] = useState([]);
  const [isEmpty, setIsEmpty] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const token = localStorage.getItem("token")

  const getBooks = async () => {
    try {
      setIsLoading(true)
      if (!params.get("q")) {
        setIsEmpty(true)
      } else {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/books?q=${(params.get("q")) || ""}`)
        if (response.data.data?.items) {
          setBookData(response.data.data.items)
        } else {
          setBookData([])
        }
        setIsEmpty(false)
      }
    } catch (error) {
      if (error.message === "Request failed with status code 400") {
        return setBookData([])
      }
      if (error.response) {
        console.warn(error.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (paramName, paramValue) => {
    const newFilter = new URLSearchParams(filter.toString());
    if (paramValue === "") {
      newFilter.delete(paramName);
      setBookData([])
    } else {
      newFilter.set(paramName, paramValue);
    }
    setFilter(newFilter);
    const params = new URLSearchParams(window.location.search);
    params.set(paramName, paramValue);
    navigate({ search: params.toString() });
  };

  useEffect(() => {
    if (token) {
      getBooks()
    }
  }, [filter])

  return (
    <div className='text-black font-inter bg-slate-100 min-h-lvh -z-10'>
      <Navbar />
      <Search id="q" isSearched={params.get("q")} value={params.get("q") || ""} onSubmit={(searchValue) => handleFilterChange("q", searchValue)} />
      {isLoading && (
        <div className='text-xl font-semibold text-center py-8'>Loading...</div>
      )}
      {/* {!isLoading && isEmpty && (
        <div className='text-xl font-semibold text-center py-8'>Result will be shown here.</div>
      )} */}
      {!isLoading && !isEmpty && bookData.length !== 0 && (
        <>
          <div className='text-xl font-semibold text-center py-8'>Result(s) of "{params.get("q")}"</div>
          <BookCard bookData={bookData} />
        </>
      )}
      {!isLoading && !isEmpty && bookData.length === 0 && (
        <>
          <div className='text-xl font-semibold text-center py-8'> No Result of "{params.get("q")}"</div>
        </>
      )}
    </div>
  )
}
