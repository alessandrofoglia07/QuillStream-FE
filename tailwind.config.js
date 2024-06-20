/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
const config = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,css}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', ...defaultTheme.fontFamily.sans]
            },
            screens: {
                '-md': { max: '767px' },
                '-sm': { max: '639px' },
                '-lg': { max: '1023px' }
            },
            borderRadius: {
                llg: '10px'
            },
            backgroundColor: {
                'light-grey': '#2D2D2D'
            }
        }
    },
    plugins: []
};

export default config;
