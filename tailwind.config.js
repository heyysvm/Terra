/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2D5A4A',
        'primary-light': '#3D7A64',
        'primary-dark': '#1E3D32',
        secondary: '#D6C7A1',
        accent: '#C86B3C',
        'accent-light': '#D98559',
        bg: '#F8F7F3',
        surface: '#FFFFFF',
        'text-primary': '#1F2937',
        'text-secondary': '#6B7280',
        success: '#4F7C59',
        warning: '#C86B3C',
        danger: '#A94442',
        'surface-2': '#F3F2EE',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px rgba(0,0,0,0.06)',
        'medium': '0 4px 25px rgba(0,0,0,0.09)',
        'strong': '0 8px 40px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}
