import * as React from 'react';
import {Icon, TextInput} from 'react-native-paper';
import globalStyles from '@constants/global-styles';
import {Image, Text, View} from 'react-native';
import {COLORS} from '@constants/theme';

const Input = ({
  label = null,
  placeholder,
  value,
  setValue,
  isSecure = false,
  editable = true,
  left,
  right,
  ...customStyle
}) => {
  const [secure, setSecure] = React.useState(isSecure);
  const [isFocused, setIsFocused] = React.useState(false);

  // Memoize the style to prevent recreation on every render
  const inputStyle = React.useMemo(() => [
    globalStyles.textInput,
    customStyle
  ], [customStyle]);
  
  // Memoize the onChangeText handler
  const handleChangeText = React.useCallback((text) => {
    setValue(text);
  }, [setValue]);
  
  // Memoize focus handlers
  const handleFocus = React.useCallback(() => {
    setIsFocused(true);
  }, []);
  
  const handleBlur = React.useCallback(() => {
    setIsFocused(false);
  }, []);

  return (
    <React.Fragment>
      {label !== null && <Text style={globalStyles.label}>{label}</Text>}

      <TextInput
        style={inputStyle}
        secureTextEntry={secure}
        outlineStyle={globalStyles.textInputOutline}
        mode="outlined"
        placeholder={placeholder}
        placeholderTextColor={COLORS.grayLight}
        textColor={COLORS.black}
        value={value}
        editable={editable}
        onChangeText={handleChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        // Add these props to improve focus behavior
        blurOnSubmit={false}
        returnKeyType="next"
        left={
          typeof left !== 'undefined' ? (
            <TextInput.Icon
              icon={props => (
                <Image
                  {...props}
                  source={left}
                  style={globalStyles.textInputIcon}
                />
              )}
            />
          ) : (
            ''
          )
        }
        right={
          typeof right !== 'undefined' ? (
            <TextInput.Icon
              icon={props => (
                <Image
                  {...props}
                  source={right}
                  style={globalStyles.textInputIcon}
                />
              )}
              onPress={() => {
                setSecure(!secure);
              }}
            />
          ) : (
            ''
          )
        }
      />
    </React.Fragment>
  );
};

export default Input;
