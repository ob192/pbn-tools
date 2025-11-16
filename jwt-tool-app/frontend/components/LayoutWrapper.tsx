'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function LayoutWrapper({ children }: { children: ReactNode }) {
    const pathname = usePathname()

    return (
        <div className="app">
            <header className="site-header">
                <nav className="container" aria-label="Main navigation">
                    <Link href="/" className="logo">
                        JWT Decoder
                    </Link>
                    <div className="nav-links">
                        <Link
                            href="/"
                            className={pathname === '/' ? 'active' : ''}
                        >
                            Home
                        </Link>
                        <Link
                            href="/blog"
                            className={pathname?.startsWith('/blog') ? 'active' : ''}
                        >
                            Blog
                        </Link>
                    </div>
                </nav>
            </header>

            <main>{children}</main>

            <footer className="site-footer" role="contentinfo">
                <div className="container">
                    <p>
                        &copy; 2025 JWT Decoder. Built with Next.js. Privacy-first,
                        client-side decoding.
                    </p>
                </div>
            </footer>

            <style jsx>{`
                .app {
                    display: flex;
                    flex-direction: column;
                    min-height: 100vh;
                }

                .site-header {
                    border-bottom: 1px solid var(--color-border);
                    background-color: var(--color-background);
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    backdrop-filter: blur(8px);
                }

                .site-header nav {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--spacing-lg);
                }

                .logo {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: var(--color-foreground);
                    text-decoration: none;
                    transition: opacity 0.2s;
                }

                .logo:hover {
                    opacity: 0.8;
                }

                .nav-links {
                    display: flex;
                    gap: var(--spacing-xl);
                }

                .nav-links a {
                    color: var(--color-muted-foreground);
                    font-weight: 600;
                    text-decoration: none;
                    transition: color 0.2s;
                    padding-bottom: 2px;
                    border-bottom: 2px solid transparent;
                }

                .nav-links a:hover {
                    color: var(--color-foreground);
                }

                .nav-links a.active {
                    color: var(--color-foreground);
                    border-bottom-color: var(--color-foreground);
                }

                main {
                    flex: 1;
                }

                .site-footer {
                    border-top: 1px solid var(--color-border);
                    padding: var(--spacing-2xl) 0;
                    background-color: var(--color-muted);
                    margin-top: var(--spacing-2xl);
                }

                .site-footer p {
                    text-align: center;
                    color: var(--color-muted-foreground);
                    margin: 0;
                    font-size: 0.875rem;
                }

                /* Responsive adjustments */
                @media (max-width: 640px) {
                    .site-header nav {
                        padding: var(--spacing-md);
                    }

                    .logo {
                        font-size: 1.125rem;
                    }

                    .nav-links {
                        gap: var(--spacing-lg);
                    }

                    .nav-links a {
                        font-size: 0.875rem;
                    }
                }
            `}</style>
        </div>
    )
}