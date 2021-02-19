module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        aquire: ['Aquire', 'sans-serif'],
      },
      colors: {
        jw: {
          DEFAULT: '#4a6da7',
          'darken-1': '#275197',
          'darken-2': '#1d3254',
        },
        input: {
          DEFAULT: '#ccc',
          darken: '#b3b3b3',
          darkhover: '#B3B3B3',
        },
      },
    },
  },
  variants: {
    extend: {
      textDecoration: ['focus-visible'],
    },
  },
}
