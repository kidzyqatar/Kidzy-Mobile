import React, {useState, useRef} from 'react';
import {View, Text, TouchableOpacity, ScrollView, Image} from 'react-native';
import {
  MasterLayout,
  BackBar,
  Phrase,
  Spacer,
  Hr,
  MyButton,
  WrapperItem,
} from '@components';
import {COLORS, SIZES, FONTS} from '@constants/theme';
import globalStyles from '@constants/global-styles';

const StepTwo = ({items, getCart}) => {
  console.log(items, 'items');
  const excludedCategories = ['13'];

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {items.map((elem, index) => {
        const hasExcludedCategory = elem?.product?.categories?.some(category =>
          excludedCategories.includes(category),
        );

        if (!hasExcludedCategory) {
          return (
            <React.Fragment key={index.toString()}>
              <Spacer />
              <WrapperItem item={elem} getCart={getCart} />
            </React.Fragment>
          );
        }

        console.log('Item filtered out - contains excluded category');
        return null;
      })}
      <Spacer />
      <Spacer />
      <Spacer />
    </ScrollView>
  );
};

export default StepTwo;
