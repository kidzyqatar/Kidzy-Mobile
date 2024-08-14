import {StyleSheet} from 'react-native';
import {COLORS, SIZES, FONTS} from '@constants/theme';

export default styles = StyleSheet.create({
  languageSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  languageText: {
    marginHorizontal: 10,
  },
  cartView: {
    width: 50,
    height: 30,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.padding,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.base,
  },
  cartViewImage: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    tintColor: COLORS.secondary,
  },
  cartViewNumber: {...FONTS.body3_bold, color: COLORS.secondary},
  topBar: {
    backgroundColor: COLORS.secondary,
    width: SIZES.hundred,
    height: 120,
    paddingHorizontal: SIZES.radius,
    paddingVertical: SIZES.padding,
    zIndex: 999,
  },
  menuBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.radius,
  },
  menuIconImg: {
    width: 20,
    height: 20,
    overflow: 'visible',
    marginLeft: 20,
    marginRight: -20,
    position: 'relative',
    bottom: 10,
  },
  menuLogo: {height: 25, resizeMode: 'contain'},
  bannerContainer: {
    zIndex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  bannerImg: {
    height: 'auto',
    flex: 1,
    aspectRatio: 1.59, // Your aspect ratio
  },
  bannerText: {
    position: 'absolute',
    top: SIZES.radius + SIZES.base + 60,
    left: SIZES.radius + SIZES.base,
    ...FONTS.rocherSmallTitle,
    color: 'white',
    textAlign: 'left',
  },
  contentView: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    marginTop: SIZES.radius,
  },
  headingView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  heading: {
    ...FONTS.rocherSmallTitle,
    color: COLORS.primary,
  },
  allLink: {color: COLORS.black, ...FONTS.body4_bold},
});
