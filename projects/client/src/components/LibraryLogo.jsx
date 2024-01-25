import React from 'react';
import { SiBookstack } from "react-icons/si";

export default function LibraryLogo() {
    return (
        <div className='grid content-center justify-center p-4 z-50 mt-7 sm:mt-0'>
            <SiBookstack className='text-white text-5xl sm:text-[7rem] text-center w-full'/>
            <div className='text-center text-white sm:text-5xl font-bold'>LIBRARY</div>
        </div>
    )
}
