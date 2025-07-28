// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FFC107',         // Soft gold
        primaryDark: '#FFA000',     // Deeper gold
        bgLight: '#FCFCFC',         // App background
        card: '#FFFFFF',
        textMain: '#1E1E1E',
        textSecondary: '#5F6368',
        income: '#388E3C',
        expense: '#D32F2F',
        border: '#E0E0E0',
      },
      fontFamily: {
        body: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
