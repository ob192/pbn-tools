// i18n/request.ts
import {getRequestConfig} from 'next-intl/server';

const locales = ['en', 'ru', 'uk'] as const;
type Locale = (typeof locales)[number];

export default getRequestConfig(async ({requestLocale}) => {
    let locale = (await requestLocale) as Locale | null;

    if (!locale || !locales.includes(locale)) {
        locale = 'en';
    }

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default
    };
});
