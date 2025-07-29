/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F3E8FF',
          100: '#E9D5FF',
          500: '#5B21B6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        secondary: {
          500: '#8B5CF6',
          600: '#7C3AED',
        },
        accent: {
          500: '#EC4899',
          600: '#DB2777',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #5B21B6 0%, #EC4899 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
        'gradient-subtle': 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
      },
      animation: {
        'check': 'check 0.3s ease-out',
        'slide-in': 'slideIn 0.2s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        check: {
          '0%': { transform: 'scale(0)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}