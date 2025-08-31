'use client'
import React from 'react'

type Props = {
    className: string;
    title: string;
}

export default function BinaryMatrixLoader({ className, title }: Props) {
    const digits = ['0', '1', '0', '1', '1', '0', '0', '1']

    return (
        <div className={className + " relative"}>
            <div className="grid grid-cols-3 gap-1 perspective-[800px]">
                {digits.map((digit, i) => (
                    <div
                        key={i}
                        className="text-[#09ff00] font-mono text-lg text-center drop-shadow-[0_0_5px_#00ff88] opacity-0 animate-matrix-fall-flicker"
                        style={{ animationDelay: `${0.2 * i + 0.1}s` }}
                    >
                        {digit}
                    </div>
                ))}
            </div>

            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,255,136,0.1)_0%,transparent_70%)] animate-matrix-pulse"></div>

            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[#09ff00] font-mono text-sm tracking-widest drop-shadow-[0_0_5px_#00ff88] animate-pulse whitespace-nowrap">
                {title}
            </div>
        </div>
    )
}
