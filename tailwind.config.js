/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/renderer/src/**/*.html",
        "./src/renderer/src/**/*.{js,jsx,ts,tsx,vue}",
        "./node_modules/@describo/**/*.vue"
    ],
    theme: {
        extend: {}
    },
    plugins: []
}
