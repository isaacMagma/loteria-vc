// tailwind.config.js
export default {
    content: [
      "./index.html",
      "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: "#1d4ed8",    // blue-700
          secondary: "#9333ea",  // purple-600
          accent: "#f59e0b",     // amber-500
        },
      },
    },
    plugins: [],
  }
  