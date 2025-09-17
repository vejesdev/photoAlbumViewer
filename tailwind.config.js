export default {
  content: {
    files: [
      './index.html',
      './src/**/*.{vue,js,ts,jsx,tsx}',
    ],
  },
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        info: '#155dfc',
        danger: '#e7000b',
      }
    }
  },
  plugins: [
    require('tailwindcss')
  ]
}