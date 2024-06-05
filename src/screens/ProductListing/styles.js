import { StyleSheet } from 'react-native';
import { SIZES, COLORS, FONTS } from '@constants/theme';

export const styles = StyleSheet.create({
  searchRowLeft: { width: SIZES.eightyFive },
  searchRowRight: { width: SIZES.fifteen },
  crossImg: { width: 12, height: 12, resizeMode: 'contain' },
  selectAgeTxt: {
    marginTop: SIZES.radius,
    color: COLORS.txtGray,
    ...FONTS.body5,
  },
  filterItem: {
    width: 'auto',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.minor,
    borderRadius: SIZES.radius,
    marginRight: SIZES.radius,
    marginBottom: SIZES.radius,
    backgroundColor: COLORS.secondaryLite,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterItemTxt: {
    color: COLORS.secondary,
    ...FONTS.body4_bold,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  filterItemImg: {
    height: 10,
    width: 10,
    resizeMode: 'contain',
    tintColor: COLORS.secondaryUltra,
    marginLeft: SIZES.radius,
  },
  ageItem: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.minor,
    borderRadius: SIZES.radius,
    marginRight: SIZES.radius,
  },
  listingContainer: { alignItems: 'center' },
  checkboxRow: {
    flexDirection: 'row',
    marginBottom: SIZES.radius,
    alignItems: 'center',
  },
  checkboxImg: { width: 20, height: 20, resizeMode: 'contain' },
  checkboxTxt: {
    color: COLORS.black,
    marginLeft: SIZES.base,
    ...FONTS.body4_medium,
  },
  productBtn: { ...FONTS.body5_bold },
  btnStyle: { paddingLeft: SIZES.padding, paddingRight: SIZES.padding, borderWidth: 0, height: 40 },
});
