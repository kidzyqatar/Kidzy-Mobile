import React, {useState, useRef, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView, Image, Platform, Keyboard} from 'react-native';
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

const StepTwo = ({
  items,
  getCart,
  resumeGiftWrapUi = false,
  onGiftWrapAttached,
}) => {
  console.log(items, 'items');
  const excludedCategories = ['13'];


  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, e => {
      setKeyboardHeight(e.endCoordinates.height);
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <ScrollView 
    keyboardShouldPersistTaps="handled"
    contentContainerStyle={{
      // minHeight: authSheetHeight, // 🔑 KEY TRICK
      flexGrow: 1,
      paddingBottom: keyboardHeight > 0 ? keyboardHeight / 1.2 : 20,
      // backgroundColor:"red"
    }}
 
    showsVerticalScrollIndicator={false}
    
    >
      {items.map((elem, index) => {
        const hasExcludedCategory = elem?.product?.categories?.some(category =>
          excludedCategories.includes(category),
        );
        if (!hasExcludedCategory) {
          return (
            <React.Fragment key={index.toString()}>
              <Spacer />
              <WrapperItem
                item={elem}
                getCart={getCart}
                resumeGiftWrapUi={resumeGiftWrapUi}
                onGiftWrapAttached={onGiftWrapAttached}
              />
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
