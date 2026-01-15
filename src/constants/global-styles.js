import {Platform, StyleSheet} from 'react-native';
import {SIZES, COLORS, FONTS} from '@constants/theme';

export default GlobalStyle = StyleSheet.create({
  textInput: {
    width: SIZES.hundred,
    // padding:2,

    height: 44,
    backgroundColor: COLORS.white,
    // backgroundColor:"red",
    // lineHeight:Platform.OS == "android" ? 25 : 20,
    padding:0,
    
  },
  textInputOutline: {borderColor: COLORS.grayLight, borderRadius: SIZES.base},
  textInputIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    borderRadius: 0,

    // backgroundColor:"blue"
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
    paddingTop: SIZES.minor,
    zIndex: 999,
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 999,
  },
  row: {
    flexDirection: 'row',
  },
  contentContainer: {
    paddingHorizontal: SIZES.base,
  },
  spaceAround: {justifyContent: 'space-around'},
  alignCenter: {alignItems: 'center'},
});
