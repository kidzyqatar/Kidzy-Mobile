import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import {
  MasterLayout,
  BackBar,
  Phrase,
  Spacer,
  Hr,
  MyButton,
  WrapperItem,
} from '@components';
import { COLORS, SIZES, FONTS } from '@constants/theme';
import globalStyles from '@constants/global-styles';

const StepTwo = ({ items, getCart }) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {items.map((elem, index) => {
        return (
          <React.Fragment key={index.toString()}>
            <Spacer />
            <WrapperItem item={elem} getCart={getCart} />
          </React.Fragment>
        );
      })}
      <Spacer />
      <Spacer />
      <Spacer />
    </ScrollView>
  );
};

export default StepTwo;
