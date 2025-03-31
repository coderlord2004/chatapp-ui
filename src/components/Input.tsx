"use client"
import React, { Ref, useState } from 'react';

type inputProps = {
    id: string,
    type: string,
    label: string,
    refElement: Ref<HTMLInputElement> | undefined,
    validation: string,
    error: string
}

function Input({ id, type, label, refElement, validation, error }: inputProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative mt-[20px]">
            <input
                id={id}
                ref={refElement}
                type={!showPassword ? type : "text"}
                className="w-full h-[35px] text-white p-1 px-3 cursor-pointer border-[1px] border-solid border-white outline-none rounded-[7px]"
                placeholder={`Enter ${label}:`}
                // {...validation}
                required
            />
            {type === "password" && <img
                src={showPassword ? "https://img.icons8.com/ultraviolet/40/blind.png" : "https://img.icons8.com/ultraviolet/40/visible.png"}
                alt={showPassword ? "hide" : "visible"}
                onClick={() => setShowPassword(!showPassword)}
                className="w-[17px] h-auto absolute top-[50%] right-[3px] transform translate-y-[-50%] cursor-pointer"
            />}
            {/* {error && <p className="w-full text-red-500 text-right">{error.message}</p>} */}
        </div>
    );
}

export default Input;