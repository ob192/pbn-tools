'use client'

import { useTabs } from './Tabs'
import { ReactNode } from 'react'

interface TabsContentProps {
    value: string
    children: ReactNode
    className?: string
}

export default function TabsContent({
                                        value,
                                        children,
                                        className = '',
                                    }: TabsContentProps) {
    const { activeTab } = useTabs()

    if (activeTab !== value) return null

    return <div className={className}>{children}</div>
}