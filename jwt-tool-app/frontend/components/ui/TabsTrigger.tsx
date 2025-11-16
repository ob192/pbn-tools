'use client'

import { useTabs } from './Tabs'

interface TabsTriggerProps {
    value: string
    children: React.ReactNode
}

export default function TabsTrigger({ value, children }: TabsTriggerProps) {
    const { activeTab, setActiveTab } = useTabs()
    const isActive = activeTab === value

    return (
        <button
            onClick={() => setActiveTab(value)}
            className={isActive ? 'active' : ''}
        >
            {children}
            <style jsx>{`
        button {
          padding: 0.5rem 1rem;
          border: none;
          background: none;
          cursor: pointer;
          font-weight: 600;
          color: var(--color-muted-foreground);
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }

        button:hover {
          color: var(--color-foreground);
        }

        button.active {
          color: var(--color-primary);
          border-bottom-color: var(--color-primary);
        }
      `}</style>
        </button>
    )
}