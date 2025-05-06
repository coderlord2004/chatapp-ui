"use client"

import React from 'react'
import { ThemeContextProvider } from '@/hooks/useTheme'
import { NotificationProvider } from '@/hooks/useNotification'

type ProvidersProps = {
    children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
    return (
        <NotificationProvider>
            <ThemeContextProvider>
                {children}
            </ThemeContextProvider>
        </NotificationProvider>
    )
}