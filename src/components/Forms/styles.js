import {StyleSheet} from 'react-native';
import {FONTS, SIZES, COLORS} from '@constants/theme';
export default styles = StyleSheet.create({
  content: {flex: 1, height: SIZES.height},
  contentTopView: {
    height: SIZES.twenty,
    paddingHorizontal: SIZES.radius,
  },
  contentMiddleView: {
    height: SIZES.seventy,
    paddingHorizontal: SIZES.radius,
    justifyContent: 'flex-start',
  },
  contentBottomView: {
    height: SIZES.ten,
    justifyContent: 'flex-end',
  },
  wrapper: {flex: 1, alignItems: 'center'},
  logo: {
    width: SIZES.fifty,
    height: 80,
    resizeMode: 'contain',
  },
  pageHeading: {color: COLORS.primary, ...FONTS.mediumTitle},
  loginBtnTxt: {...FONTS.body5},
  loginBtnTxtInner: {...FONTS.body5_bold},
  privacyTxt: {
    ...FONTS.body5_medium,
    textAlign: 'center',
    marginTop: SIZES.radius,
    color: COLORS.gray,
  },
  privacyTxtLink: {color: COLORS.danger},
});
