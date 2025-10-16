module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        deep: {
          900: '#0b1221',
          800: '#0f1724'
        },
        electric: '#7df9ff',
        accent: '#8a5cff'
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, rgba(10,25,47,0.8), rgba(6,10,20,0.8))'
      }
    }
  },
  plugins: [],
}
