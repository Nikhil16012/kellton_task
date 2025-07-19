module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#60a5fa', // blue-400
          DEFAULT: '#2563eb', // blue-600
          dark: '#1e40af', // blue-800
        },
        secondary: {
          light: '#f3f4f6', // gray-100
          DEFAULT: '#6b7280', // gray-500
          dark: '#111827', // gray-900
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        card: '0 2px 8px 0 rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
};