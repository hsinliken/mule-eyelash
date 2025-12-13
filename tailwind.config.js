/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#FAF9F6', // Off-white / Cream
                    100: '#F5F5F0',
                    200: '#E6E2DD',
                    300: '#D7CCC8', // Light Brown
                    400: '#BCAAA4',
                    500: '#A1887F', // Main Brown
                    600: '#8D6E63', // Darker Brown
                    700: '#795548',
                    800: '#5D4037', // Deep Brown
                    900: '#3E2723',
                }
            },
            fontFamily: {
                sans: ['Helvetica Neue', 'Arial', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
