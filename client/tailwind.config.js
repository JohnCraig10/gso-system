module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            // backgroundImage: {
            //     art: "url('../public/img/art.jpg')",
            // },
            fontFamily: {
                roboto: ['"Roboto Flex"', "system-ui"],
            },
            screens: {
                xs: "500px",
            },
        },
    },
    plugins: [require("@tailwindcss/line-clamp")],
    important: true,
};
