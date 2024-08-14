import React from 'react';
import {View, TextInput, Text, StyleSheet, Platform} from 'react-native';
import globalStyles from '@constants/global-styles';
import {COLORS, SIZES, FONTS} from '@constants/theme';

const PrefixTextInput = ({
  prefix,
  label = null,
  placeholder,
  value,
  setValue,
  isSecure = false,
  maxLength = 20,
}) => {
  return (
    <>
      {label !== null && <Text style={globalStyles.label}>{label}</Text>}
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
            },
          ]}
          secureTextEntry={isSecure}
          outlineStyle={globalStyles.textInputOutline}
          placeholder={placeholder}
          placeholderTextColor={COLORS.grayLight}
          textColor={COLORS.primary}
          value={value}
          setValue={setValue}
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
  prefixView: {
    width: SIZES.fifteen,
    height: 44,
    backgroundColor: COLORS.bgGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  prefix: {
    color: COLORS.black,
  },
});

export default PrefixTextInput;
