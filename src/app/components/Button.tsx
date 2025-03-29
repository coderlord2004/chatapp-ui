"use client"

import React, { useState } from 'react'

type ButtonProps = {
    text: string
}

function Button({ text }: ButtonProps) {
    const [count, setCount] = useState(0)

    return (
        <div>
            <h1>{count}</h1>
            <button onClick={() => setCount(count + 1)}>{text}</button>
        </div>
    )
}

export default Button