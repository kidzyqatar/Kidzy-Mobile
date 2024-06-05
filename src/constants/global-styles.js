import { Platform, StyleSheet } from 'react-native';
import { SIZES, COLORS, FONTS } from '@constants/theme';

export default GlobalStyle = StyleSheet.create({
  textInput: {
    width: SIZES.hundred,
    height: 44,
    backgroundColor: COLORS.white,
    lineHeight: Platform.OS == 'android' ? 44 : 20,
  },
  textInputOutline: { borderColor: COLORS.grayLight, borderRadius: SIZES.base },
  textInputIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    borderRadius: 0,
  },
  label: {
    width: SIZES.hundred,
    color: COLORS.black,
    ...FONTS.body5_medium,
    marginBottom: SIZES.minor,
  },
  whiteBg: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    zIndex: 999
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 999
  },
  row: {
    flexDirection: 'row',
  },
  contentContainer: {
    paddingHorizontal: SIZES.base,
  },
  spaceAround: { justifyContent: 'space-around' },
  alignCenter: { alignItems: 'center' },
});
