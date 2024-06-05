import * as React from 'react';
import { Icon, TextInput } from 'react-native-paper';
import globalStyles from '@constants/global-styles';
import { Image, Text, View } from 'react-native';
import { COLORS } from '@constants/theme';

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

  return (
    <React.Fragment>
      {label !== null && <Text style={globalStyles.label}>{label}</Text>}

      <TextInput
        style={[globalStyles.textInput, { ...customStyle }]}
        secureTextEntry={secure}
        outlineStyle={globalStyles.textInputOutline}
        mode="outlined"
        placeholder={placeholder}
        placeholderTextColor={COLORS.grayLight}
        textColor={COLORS.black}
        value={value}
        setValue={setValue}
        editable={editable}
        onChangeText={text => {
          setValue(text);
        }}
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
