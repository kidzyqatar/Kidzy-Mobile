import React, {useContext} from 'react';
import {View, TextInput, Text, StyleSheet, Platform, I18nManager} from 'react-native';
import globalStyles from '@constants/global-styles';
import {COLORS, SIZES, FONTS} from '@constants/theme';
import {LanguageContext} from '../../store/LanguageContext';

const PrefixTextInput = ({
  prefix,
  label = null,
  placeholder,
  value,
  setValue,
  isSecure = false,
  maxLength = 20,
}) => {
  const {language} = useContext(LanguageContext);
  const isRTL = language === 'AR' || I18nManager.isRTL;
  
  return (
    <>
      {label !== null && <Text style={globalStyles.label}>{label}</Text>}
      {/* <View style={[styles.container, isRTL && styles.containerRTL]}>
        <View style={[styles.prefixView, isRTL && styles.prefixViewRTL]}> */}
         <View style={styles.container}>
         <View style={styles.prefixView}>
          <Text style={styles.prefix}>{prefix}</Text>
        </View>
        <TextInput
          style={[
            globalStyles.textInput,
            {
              marginTop: Platform.OS == 'android' ? 2 : -2,
              paddingBottom:
                Platform.OS == 'ios' ? SIZES.radius - 4 : SIZES.radius - 4,
              color: COLORS.black,
              textAlign: isRTL ? 'right' : 'left',
            },
          ]}
          secureTextEntry={isSecure}
          outlineStyle={globalStyles.textInputOutline}
          placeholder={placeholder}
          placeholderTextColor={COLORS.grayLight}
          textColor={COLORS.primary}
          value={value}
          maxLength={maxLength}
          onChangeText={text => {
            // Filter out non-numeric characters
            const numericText = text.replace(/[^0-9]/g, '');
            setValue(numericText);
          }}
          keyboardType="numeric"
          textContentType="telephoneNumber"
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    borderRadius: SIZES.base,
    // paddingHorizontal: 10,
    marginTop: 10,
    overflow: 'hidden',
  },
  containerRTL: {
    flexDirection: 'row-reverse',
  },
  prefixView: {
    width: SIZES.fifteen,
    height: 44,
    backgroundColor: COLORS.bgGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  prefixViewRTL: {
    marginRight: 0,
    marginLeft: 10,
  },
  prefix: {
    color: COLORS.black,
  },
});

export default PrefixTextInput;
