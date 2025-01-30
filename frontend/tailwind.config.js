/** @type {import('tailwindcss').Config} */
module.exports = {
  // Specifiy the files thay use Tailwind CSS classes in the form of nativewind
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    // No extended theme is used in this configuration
    extend: {},
  },
  // No plugins are used in this configuration
  plugins: [],
};