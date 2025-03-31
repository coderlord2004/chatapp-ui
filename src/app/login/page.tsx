import React from 'react'
import Input from '@/components/Input'
import Link from 'next/link'

type loginProps = {}

export default function Login({ }: loginProps) {
    return (
        <div className="flex justify-center items-center fixed top-0 left-0 right-0 bottom-0 bg-black/30">
            <div className="w-[55%] h-[60%] border-[1px] border-solid border-white rounded-[10px] flex justify-center items-center p-[10px]">
                <div className="w-[45%] flex flex-col items-center">
                    <img src="./logo.jpeg" alt="" className="rounded-[50%] w-[70px] h-[70px]" />
                    <h1 className="w-full text-center">Log in connect with your friend!</h1>
                </div>
                <form className="w-[55%] h-full border-[1px] border-solid border-white rounded-[10px] p-[10px] shadow-[2px_2px_2px_grey]">
                    <Input id="username" type="text" label="username" refElement={undefined} validation='' error='' />
                    <Input id="password" type="password" label="password" refElement={undefined} validation='' error='' />
                    <div className="flex justify-between items-center px-[10px]">
                        <p>Don't have an account?</p>
                        <Link href="/signup">Sign up</Link>
                    </div>
                    <button className="w-full cursor-pointer h-[30px] bg-blue-600 rounded-[8px] mt-[10px]" type="submit">Log in</button>
                </form>
            </div>
        </div>
    )
}