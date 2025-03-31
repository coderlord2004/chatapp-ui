import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

type HeaderProps = {

}

function Header() {
    return (
        <header className="h-[50px] fixed top-[5px] right-[5px] left-[5px] bg-black/50 flex items-center z-10 rounded-[10px] p-[5px] px-[10px]">
            <img
                src="./logo.jpeg"
                alt=""
                className="w-auto h-full rounded-[50%] ml-[5%] border-[1px] border-solid border-white"
            />
            <div className="mx-auto w-[50%] flex justify-evenly">
                <Link href="/home">Home</Link>
                <button>Search</button>
                <button>Contact us</button>
                <button>Report</button>
            </div>
            <div className="flex justify-center items-center gap-[10px]">
                <Link href="/login">Log in</Link>
                <div className='w-[1px] h-[25px] bg-white'></div>
                <Link href="/signup">Sign up</Link>
            </div>
        </header>
    )
}

export default Header