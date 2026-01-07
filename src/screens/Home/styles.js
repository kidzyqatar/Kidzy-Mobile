import {StyleSheet, Platform} from 'react-native';
import {COLORS, SIZES, FONTS} from '@constants/theme';

export default styles = StyleSheet.create({
  languageSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    ...Platform.select({
      ios: {
        marginVertical: 5,
      },
      android: {
        marginTop: 10,
      },
    }),
  },
  languageText: {
    paddingHorizontal: 5,
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
    // backgroundColor: 'red',
    width: SIZES.hundred,
    height: 110,
    paddingHorizontal: SIZES.radius,
    paddingVertical: SIZES.base,
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
    paddingTop:0,
    marginTop:10,
    // backgroundColor:'red'
    // marginTop: SIZES.base,
  },
  headingView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor:"green",
    zIndex: 1,
  },
  heading: {
    ...FONTS.rocherSmallTitle,
    color: COLORS.primary,
    ...Platform.select({
      ios: {
        paddingVertical: 10,
      },
    }),
    // backgroundColor:"blue"
  },
  allLink: {
    color: COLORS.black,
    ...FONTS.body4_bold,
    ...Platform.select({
      ios: {
        paddingVertical: 8,
      },
    }),
  },
  catImg:{
    flex:1,
    height:100,
    // width:40
  },
  txt: {...FONTS.body3_bold, color: COLORS.white},
});
