/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#EDF3FF",
        secondary: "#007942",
        textGray:"#838383",
        lightBlue:"#EDF3FF",
        borderGray:"#E4E4E4",
        inputBg:"#D9D9D9",
        white:"#ffffff",
        black:"#000000",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
