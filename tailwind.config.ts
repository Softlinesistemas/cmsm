/** @type {import('tailwindcss').Config} */ 
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        militarGreen: '#0b1b0b',
        militarLime: '#2ec600',
        militarDark: '#003800'
      },
    },
  },
  plugins: [],
}

//   theme: {
//     screens: {
//       fxl: { max: "1700px" },
//       cxl: { max: "1300px" },
//       xl: { max: "1200px" },
//       lg: { max: "1023px" },
//       mdx: { max: "890px" },
//       md: { max: "768px" },
//       sm: { max: "639px" },
//       usm: { max: "400px" },
//     },
//     extend: {
//       colors: {
//         link: "#0966C2",
//         white: {
//           light: "#FFFFFF",
//           medium: "#EAEAEA",
//           dark: "#DDDDDD",
//         },
//         black: {
//           light: "#5B5B5B",
//           dark: "#212121",
//           all: "#000000",
//         },
//         primary: "#5c1c1c",
//         transparentBlue: 'rgba(229, 243, 255, 0.5)'
//       },
//       backgroundImage: {
//         "custom-gradient": "linear-gradient(270deg, #5c1c1c 0%, #731515 100%)",
//         "custom-gradient-hover": "linear-gradient(270deg, #4a1616 0%, #5d1010 100%)"
//       },
//       boxShadow: {
//         custom: "rgba(0, 0, 0, 0.20) 5px 5px 7px",
//       },
//       keyframes: {
//         glow: {
//           '0%': { boxShadow: '0 0 3px #5c1c1c, 0 0 6px #731515' },
//           '50%': { boxShadow: '0 0 6px #5c1c1c, 0 0 12px #731515' },
//           '100%': { boxShadow: '0 0 3px #5c1c1c, 0 0 6px #731515' },
//         },
//       },
//       animation: {
//         glow: 'glow 2s infinite ease-in-out',
//       },
//     },
//   },
//   plugins: [
//     function ({ addUtilities }: any) {
//       addUtilities({
//         '.hide-scrollbar': {
//           '-ms-overflow-style': 'none', /* IE e Edge */
//           'scrollbar-width': 'none',    /* Firefox */
//         },
//         '.hide-scrollbar::-webkit-scrollbar': {
//           display: 'none',              /* Chrome e Safari */
//         },
//       });
//     },
//   ],
// };