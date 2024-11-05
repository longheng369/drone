/** @type {import('tailwindcss').Config} */
export default {
   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
   theme: {
      extend: {
         fontSize: {
            "3xl": "1.75rem",
         },
         fontFamily: {
            anton: ['"Anton SC"', 'sans-serif'], // Custom font
          },
         screens: {
            xs: "430px",
         },
      },
   },
   plugins: [require("daisyui")],
};
