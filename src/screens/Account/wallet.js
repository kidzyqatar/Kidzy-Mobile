import React from 'react';
import {View, Text, TouchableOpacity, ScrollView, Image} from 'react-native';
import {
  MasterLayout,
  BackBar,
  Phrase,
  Spacer,
  Hr,
  MyButton,
  OrderItem,
  Chip,
} from '@components';
import {COLORS, SIZES, FONTS} from '@constants/theme';
import globalStyles from '@constants/global-styles';
import {styles} from './styles';
import {wallet} from '@constants/icons';
import {useTranslation} from 'react-i18next';

const Wallet = () => {
  const {t} = useTranslation();

  return (
    <MasterLayout bgColor={COLORS.bgGray} scrolling={false} max={true}>
      <View style={globalStyles.whiteBg}>
        <BackBar title={t('wallet')} navigateTo={'Account'} />
      </View>
      <Spacer />
      <View
        style={[
          globalStyles.whiteBg,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <Image
          source={wallet}
          style={{width: 100, height: 100, resizeMode: 'contain'}}
        />
        <Spacer />
        <Phrase
          txt={t('yourBalance')}
          txtStyle={{...FONTS.body4, color: COLORS.black}}
        />
        <Phrase
          txt={'QAR 0.00'}
          txtStyle={{...FONTS.body2_bold, color: COLORS.black}}
        />
        <Spacer />
        <MyButton
          label={t('addFunds')}
          txtColor={COLORS.white}
          btnColor={COLORS.secondary}
          borderColor={COLORS.secondary}
        />
      </View>
    </MasterLayout>
  );
};

export default Wallet;
