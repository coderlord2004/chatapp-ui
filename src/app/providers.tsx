"use client"

import React from 'react'
import { ThemeContextProvider } from '@/hooks/useTheme'

type ProvidersProps = {
    children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
    return (
        <ThemeContextProvider>
            {children}
        </ThemeContextProvider>
    )
}