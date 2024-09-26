module.exports = {
  mode: 'jit',  // Enable JIT mode
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',   // Ensure that your `pages/` directory is included
    './components/**/*.{js,ts,jsx,tsx}', // Ensure your `components/` directory is included
    './app/**/*.{js,ts,jsx,tsx}',       // This is important if you're using the new app router in Next.js 13
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')], // Optional plugins for forms, etc.
};
