// module.exports = {
//   content: [
//     './src/**/*.{js,jsx,ts,tsx}',
//   ],
//   theme: {
//     extend: {
//       colors: {
//         cyan: {
//           500: '#06b6d4',
//           600: '#0891b2',
//         },
//         blue: {
//           500: '#3b82f6',
//           600: '#2563eb',
//         },
//         purple: {
//           500: '#8b5cf6',
//           600: '#7c3aed',
//         },
//         pink: {
//           500: '#ec4899',
//           600: '#db2777',
//         },
//       },
//       animation: {
//         'gradient-x': 'gradient-x 6s ease infinite',
//         'shimmer': 'shimmer 1.5s infinite',
//       },
//       keyframes: {
//         'gradient-x': {
//           '0%, 100%': { 'background-position': '0% 50%' },
//           '50%': { 'background-position': '100% 50%' },
//         },
//         'shimmer': {
//           '0%': { 'transform': 'translateX(-100%)' },
//           '100%': { 'transform': 'translateX(100%)' },
//         },
//       },
//     },
//   },
//   plugins: [],
// };




// filepath: d:\finance-app\frontend\tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cyan: {
          500: '#06b6d4',
          600: '#0891b2',
        },
        blue: {
          500: '#3b82f6',
          600: '#2563eb',
        },
        purple: {
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        pink: {
          500: '#ec4899',
          600: '#db2777',
        },
      },
      animation: {
        'gradient-x': 'gradient-x 6s ease infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        'shimmer': {
          '0%': { 'transform': 'translateX(-100%)' },
          '100%': { 'transform': 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};