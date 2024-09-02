import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

export const COLORS = {
  primary: '#FF4405',
  secondary: '#088AB2',
  secondaryLite: '#D7F1F7',
  secondaryUltra: '#0BA5EC',
  success: '#38b54b',
  info: '#17a2b8',
  warning: '#f0b73e',
  danger: '#e51c23',
  black: '#000000',
  white: '#ffffff',
  gray: '#757575',
  bgGray: '#F2F4F7',
  iconGray: '#98A2B3',
  grayLight: '#D0D5DD',
  categoryBackground: '#D1FADF',
  txtGray: '#667085',
  girls: '#D50075',
  cartBtn: '#E9F6F9',
  bottomSheetBackground: 'rgba(0, 0, 0, 0.5)',
};

export const SIZES = {
  // spacings
  minor: 5,
  base: 8,
  radius: 12,
  padding: 22,

  // font sizes
  extraLargeTitle: 42,
  largeTitle: 36,
  small: 20,
  h1: 30,
  h2: 24,
  h3: 20,
  h4: 18,
  h6: 16,
  body1: 30,
  body2: 22,
  body3: 18,
  body4: 16,
  body5: 14,
  body6: 12,
  body7: 10,
  body8: 6,

  //   percentage sizes
  five: '5%',
  ten: '10%',
  fifteen: '15%',
  twenty: '20%',
  twentyFive: '25%',
  thirty: '30%',
  thirtyFive: '35%',
  fourty: '40%',
  fourtyFive: '45%',
  fifty: '50%',
  fiftyFive: '55%',
  sixty: '60%',
  sixtyFive: '65%',
  seventy: '70%',
  seventyFive: '75%',
  eighty: '80%',
  eightyFive: '85%',
  ninty: '90%',
  nintyFive: '95%',
  nintyNine: '99%',
  hundred: '100%',

  // app dimensions
  width,
  height,
};

export const FONTS = {
  rocherLargeTitle: {fontFamily: 'Rocher-Regular', fontSize: SIZES.largeTitle},
  rocherMediumTitle: {
    fontFamily: 'Rocher-Regular',
    fontSize: SIZES.h1,
    lineHeight: 38,
  },
  rocherExtraLargeTitle: {
    fontFamily: 'Rocher-Regular',
    fontSize: SIZES.extraLargeTitle,
    lineHeight: 42,
  },
  rocherSmallTitle: {
    fontFamily: 'Rocher-Regular',
    fontSize: SIZES.small,
    lineHeight: 26,
  },
  largeTitle: {fontFamily: 'Inter-Bold', fontSize: SIZES.largeTitle},
  mediumTitle: {fontFamily: 'Inter-Bold', fontSize: SIZES.h1},
  extraLargeTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: SIZES.extraLargeTitle,
    lineHeight: 42,
  },
  h1: {fontFamily: 'Inter-Bold', fontSize: SIZES.h1, lineHeight: 36},
  h2: {fontFamily: 'Inter-Bold', fontSize: SIZES.h2, lineHeight: 30},
  h3: {fontFamily: 'Inter-Bold', fontSize: SIZES.h3, lineHeight: 22},
  h4: {fontFamily: 'Inter-bold', fontSize: SIZES.h4, lineHeight: 22},
  h5: {fontFamily: 'Inter-bold', fontSize: SIZES.h5, lineHeight: 22},
  h6: {fontFamily: 'Inter-bold', fontSize: SIZES.h6, lineHeight: 22},
  body1: {fontFamily: 'Inter-Regular', fontSize: SIZES.body1, lineHeight: 36},
  body2: {fontFamily: 'Inter-Regular', fontSize: SIZES.body2, lineHeight: 30},
  body3: {fontFamily: 'Inter-Regular', fontSize: SIZES.body3, lineHeight: 22},
  body4: {fontFamily: 'Inter-Regular', fontSize: SIZES.body4, lineHeight: 22},
  body5: {fontFamily: 'Inter-Regular', fontSize: SIZES.body5, lineHeight: 22},
  body6: {fontFamily: 'Inter-Regular', fontSize: SIZES.body6, lineHeight: 16},
  body7: {fontFamily: 'Inter-Regular', fontSize: SIZES.body7, lineHeight: 16},
  body8: {fontFamily: 'Inter-Regular', fontSize: SIZES.body8, lineHeight: 16},
  body1_medium: {
    fontFamily: 'Inter-Medium',
    fontSize: SIZES.body1,
    lineHeight: 36,
    fontWeight: '600',
  },
  body2_medium: {
    fontFamily: 'Inter-Medium',
    fontSize: SIZES.body2,
    lineHeight: 30,
    fontWeight: '600',
  },
  body3_medium: {
    fontFamily: 'Inter-Medium',
    fontSize: SIZES.body3,
    lineHeight: 22,
    fontWeight: '600',
  },
  body4_medium: {
    fontFamily: 'Inter-Medium',
    fontSize: SIZES.body4,
    lineHeight: 22,
    fontWeight: '600',
  },
  body5_medium: {
    fontFamily: 'Inter-Medium',
    fontSize: SIZES.body5,
    lineHeight: 22,
    fontWeight: '600',
  },
  body6_medium: {
    fontFamily: 'Inter-Medium',
    fontSize: SIZES.body6,
    lineHeight: 16,
    fontWeight: '600',
  },
  body1_bold: {
    fontFamily: 'Inter-Bold',
    fontSize: SIZES.body1,
    lineHeight: 36,
    fontWeight: 'bold',
  },
  body2_bold: {
    fontFamily: 'Inter-Bold',
    fontSize: SIZES.body2,
    lineHeight: 30,
    fontWeight: 'bold',
  },
  body3_bold: {
    fontFamily: 'Inter-Bold',
    fontSize: SIZES.body3,
    lineHeight: 22,
    fontWeight: 'bold',
  },
  body4_bold: {
    fontFamily: 'Inter-Bold',
    fontSize: SIZES.body4,
    lineHeight: 22,
    fontWeight: 'bold',
  },
  body5_bold: {
    fontFamily: 'Inter-Bold',
    fontSize: SIZES.body5,
    lineHeight: 22,
    fontWeight: 'bold',
  },
  body6_bold: {
    fontFamily: 'Inter-Bold',
    fontSize: SIZES.body6,
    lineHeight: 16,
    fontWeight: 'bold',
  },

  body7_bold: {
    fontFamily: 'Inter-Bold',
    fontSize: SIZES.body7,
    lineHeight: 16,
    fontWeight: 'bold',
  },
  body8_bold: {
    fontFamily: 'Inter-Bold',
    fontSize: SIZES.body8,
    lineHeight: 16,
    fontWeight: 'bold',
  },
};

const theme = {COLORS, SIZES, FONTS};

export default theme;
