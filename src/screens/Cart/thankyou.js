import {View, Text, Image, TextBase} from 'react-native';
import React from 'react';
import {MasterLayout, BackBar, Spacer, MyButton, Phrase} from '@components';
import globalStyles from '@constants/global-styles';
import {COLORS, SIZES, FONTS} from '@constants/theme';
import {thankyouImg} from '@constants/images';
import {styles} from './styles';
import * as RootNavigation from '@navigators/RootNavigation';
import {useTranslation} from 'react-i18next';

const Thankyou = () => {
  const {t} = useTranslation();
  return (
    <MasterLayout bgColor={COLORS.bgGray} scrolling={false} max={true}>
      <View style={globalStyles.whiteBg}>
        <BackBar title={t('orderComplete')} navigateTo={'HomeScreen'} />
      </View>
      <Spacer />
      <View style={styles.thankyouContainer}>
        <Image source={thankyouImg} style={styles.thankyouImgImg} />
        <Phrase txt={t('orderPlaced')} txtStyle={styles.thankyouHeading} />
        <Phrase txt={t('orderPlacedText')} txtStyle={styles.thankyouContent} />
        <MyButton
          label={t('backToHome')}
          txtColor={COLORS.white}
          btnColor={COLORS.secondary}
          borderColor={COLORS.secondary}
          onPress={() => {
            RootNavigation.navigate('HomeScreen');
          }}
          btnStyle={{width: SIZES.fourty}}
        />
      </View>
    </MasterLayout>
  );
};

export default Thankyou;
