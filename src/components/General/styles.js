
import { StyleSheet } from 'react-native';
import { SIZES, COLORS, FONTS } from '../../constants';
const styles = StyleSheet.create({
    container: {
        // width: SIZES.hundred,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        // marginBottom: SIZES.radius,
    },
    containerDescription: {
        // width: SIZES.hundred,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: SIZES.radius,
    },
    heading: {
        // width: SIZES.eightyFive,
        color: COLORS.secondary,
        marginStart: SIZES.minor,
        ...FONTS.body4_bold,
    },
    headingWithoutImage: {
        // width: '97%',
        color: COLORS.secondary,
        // marginStart: SIZES.base,
        // marginEnd: SIZES.base,
        ...FONTS.body4_bold,
    },
    headerImg: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    arrowImg: {
        width: 15,
        resizeMode: 'contain',
    },
    bodyTxt: {
        color: COLORS.txtGray,
        ...FONTS.body5,
    },
    bodyTxtBold: {
        color: COLORS.txtGray,
        ...FONTS.body5_bold,
    },
});

export default styles;

