'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface TabsContextType {
    activeTab: string
    setActiveTab: (value: string) => void
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

export const useTabs = () => {
    const context = useContext(TabsContext)
    if (!context) throw new Error('useTabs must be used within Tabs')
    return context
}

interface TabsProps {
    children: ReactNode
    defaultValue: string
    className?: string
}

export default function Tabs({ children, defaultValue, className = '' }: TabsProps) {
    const [activeTab, setActiveTab] = useState(defaultValue)

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <div className={className}>{children}</div>
        </TabsContext.Provider>
    )
}