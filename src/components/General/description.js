import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import styles from './styles';
import { FONTS, COLORS } from '@constants/theme';

const Description = ({
    description,
    isBold,
    containerStyle,
    textStyle,
    numberOfLines,
}) => {
    return (
        <View style={[styles.containerDescription, { ...containerStyle }]}>
            {numberOfLines ? (
                <Text
                    numberOfLines={numberOfLines}
                    ellipsizeMode="tail"
                    style={[
                        isBold ? styles.bodyTxtBold : styles.bodyTxt,
                        { color: COLORS.txtGray, ...textStyle },
                    ]}>
                    {description}
                </Text>
            ) : (
                <Text
                    style={[
                        isBold ? styles.bodyTxtBold : styles.bodyTxt,
                        { color: COLORS.txtGray, ...textStyle },
                    ]}>
                    {description}
                </Text>
            )}
        </View>
    );
};

export default Description;