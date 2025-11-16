import { ReactNode } from 'react'

interface TabsListProps {
    children: ReactNode
    className?: string
}

export default function TabsList({ children, className = '' }: TabsListProps) {
    return (
        <div className={className}>
            {children}
            <style jsx>{`
        div {
          display: flex;
          gap: 0.5rem;
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 0.5rem;
        }
      `}</style>
        </div>
    )
}