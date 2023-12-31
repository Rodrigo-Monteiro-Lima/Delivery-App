module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        green: {
          light: '#2FC18C',
          dark: '#036B52',
          hover1: '#035c47',
          hover2: '#2aaf81',
          hover3: '#f5f8f7',
        },
        blue: {
          light: '#056CF9',
          dark: '#421981',
          hoverLgOut: '#0561e0',
        },
        white: '#FFFFFF',
        delivered: '#00CC9B',
        inTransit: '#5bb5d9',
        preparing: '#66CC00',
        pending: '#CCB800',
        bg0: '#EAF1EF',
        bg1: '#F2FFFC',
        tableBg: '#FBFFFE',
        border0: '#B1C2BE',
        bgLogin: '#EAF1EF',
        bgLBorder: '#B1C2BE',
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
    },
  },
  plugins: [],
};
