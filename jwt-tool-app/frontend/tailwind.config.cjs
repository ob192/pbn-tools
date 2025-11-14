/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{html,js,svelte,ts}',
        './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
        './node_modules/flowbite/**/*.{js,ts}'
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['system-ui', 'ui-sans-serif', 'sans-serif'],
                mono: [
                    'SFMono-Regular',
                    'Menlo',
                    'Monaco',
                    'ui-monospace',
                    'monospace'
                ]
            },
            colors: {
                border: '#e5e7eb',
                muted: '#6b7280'
            },
            borderRadius: {
                '2xl': '1rem'
            },
            boxShadow: {
                soft: '0 14px 45px rgba(15,23,42,0.06)'
            }
        }
    },
    plugins: []
};
