/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eaf5ff',
          100: '#d8ecff',
          200: '#b3daff',
          300: '#80bfff',
          400: '#4d9eff',
          500: '#1a7cff',
          600: '#0061e6',
          700: '#004dbd',
          800: '#003e94',
          900: '#00397a',
        },
        secondary: {
          50: '#e6f9fa',
          100: '#d0f4f6',
          200: '#a2e9ec',
          300: '#74dfe3',
          400: '#47d4d9',
          500: '#1ac0c6',
          600: '#15999e',
          700: '#117376',
          800: '#0d5c5e',
          900: '#094546',
        },
        neutral: {
          50: '#f8f9fa',
          100: '#ebeef0',
          200: '#dfe4e8',
          300: '#cbd3da',
          400: '#9fadb8',
          500: '#708797',
          600: '#5a6b7a',
          700: '#44505c',
          800: '#2d353e',
          900: '#161a1f',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'slide-left': 'slideLeft 0.5s ease-out',
        'slide-right': 'slideRight 0.5s ease-out',
        'bubble-in': 'bubbleIn 0.3s ease-out',
        'bubble-out': 'bubbleOut 0.2s ease-in',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        bubbleIn: {
          '0%': { transform: 'translateY(15px) scale(0.95)', opacity: 0 },
          '100%': { transform: 'translateY(0) scale(1)', opacity: 1 },
        },
        bubbleOut: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: 1 },
          '100%': { transform: 'translateY(-10px) scale(0.95)', opacity: 0 },
        },
      },
    },
  },
  plugins: [],
}

