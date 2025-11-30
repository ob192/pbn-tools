// middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
    locales: ['en', 'ru', 'uk'],
    defaultLocale: 'en',
    localePrefix: 'always',
});

export const config = {
    matcher: [
        // Exclude technical files
        '/((?!_next|.*\\..*|sitemap\\.xml|robots\\.txt|site\\.webmanifest).*)',
    ],
};
