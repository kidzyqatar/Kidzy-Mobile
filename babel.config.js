module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@assets': './src/assets',
          '@constants': './src/constants',
          '@components': './src/components',
          '@screens': './src/screens',
          '@navigators': './src/navigators',
        },
      },
    ],
  ],
  env: {
    // Configuration for the production environment
    production: {
      // Additional plugins for production build
      plugins: ['react-native-paper/babel'],
    },
  },
};
