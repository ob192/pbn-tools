import { ReactNode } from 'react'
import styles from './Card.module.css'

interface CardProps {
    children: ReactNode
    padding?: 'sm' | 'md' | 'lg'
    className?: string
}

export default function Card({ children, padding = 'md', className = '' }: CardProps) {
    const paddingClass = styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}`]

    return (
        <div className={`${styles.card} ${paddingClass} ${className}`.trim()}>
            {children}
        </div>
    )
}