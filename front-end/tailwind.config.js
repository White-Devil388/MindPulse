/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          cyan: '#22D3EE',
          blue: '#3B82F6',
          violet: '#6D28D9',
          dark: '#1E2A5A',
          muted: '#7A86B6',
          soft: '#EAF6FF',
          accent: '#FF6B3D',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'Noto Sans Devanagari', 'sans-serif'],
      },
      boxShadow: {
        '3d-soft': '0 20px 40px -15px rgba(30, 42, 90, 0.1)',
        '3d-float': '0 25px 50px -12px rgba(59, 130, 246, 0.25)',
        '3d-card': '0 15px 35px rgba(0, 0, 0, 0.06), 0 5px 15px rgba(0, 0, 0, 0.04)',
        '3d-glow': '0 0 30px rgba(59, 130, 246, 0.4)',
      }
    },
  },
  plugins: [],
}

