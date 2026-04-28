// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   FlatList,
//   Touchable,
//   TouchableOpacity,
//   Modal,
//   Alert,
// } from 'react-native';
// import React, {Fragment, useState} from 'react';
// import globalStyles from '@constants/global-styles';
// import {COLORS, SIZES, FONTS} from '@constants/theme';
// import {Phrase, Hr, Spacer, Input, MyButton} from '@components';
// import {
//   wrapper1,
//   wrapper2,
//   wrapper3,
//   wrapper4,
//   customImg,
// } from '@constants/images';
// import {Switch} from 'react-native-paper';
// import {upload, eye, bin, checked, unchecked} from '@constants/icons';
// import {useDispatch, useSelector} from 'react-redux';
// import {launchImageLibrary} from 'react-native-image-picker';
// import {callNonTokenApi, callNonTokenApiMP} from '../../helpers/ApiRequest';
// import config from '../../constants/config';
// import axios from 'axios';
// import {setLoader} from '../../store/reducers/global';
// import {useTranslation} from 'react-i18next';

// const WrapperItem = ({item, getCart}) => {
//   const {t} = useTranslation();
//   const global = useSelector(state => state.global);
//   const dispatch = useDispatch();
//   const [wrapperSwitch, setWrapperSwitch] = useState(false);
//   const [cardSwitch, setCardSwitch] = useState(false);
//   const [orderItemID, setOrderItemId] = useState(item.id);
//   const [selectedWrapper, setSelectedWrapper] = useState(null);
//   const [selectedCImage, setSelectedCImage] = useState(null);
//   const [from, setFrom] = useState('');
//   const [to, setTo] = useState('');
//   const [msg, setMsg] = useState('');
//   const [copy, setCopy] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [whichImage, setWhichImage] = useState(null);

//   const toggleModal = () => {
//     setModalVisible(!modalVisible);
//   };

//   const toggleWrapperSwitch = () => setWrapperSwitch(!wrapperSwitch);
//   const toggleCardSwitch = () => setCardSwitch(!cardSwitch);

//   const wrappers = global.allWrappers;

//   const addMessage = async () => {
//     if (to === null) {
//       return;
//     }
//     if (from === null) {
//       return;
//     }
//     if (msg === null) {
//       return;
//     }
//     dispatch(setLoader(true));
//     callNonTokenApi(config.apiName.attachGiftCard, 'POST', {
//       from: from,
//       to: to,
//       message: msg,
//       copy: copy,
//       order_item_id: item.id,
//     })
//       .then(res => {
//         dispatch(setLoader(false));

//         if (res.status == 200) {
//           getCart();
//         } else {
//           Alert.alert('Error!', res.message);
//         }
//       })
//       .catch(err => {
//         dispatch(setLoader(false));
//         Alert.alert(t('serverError'));
//       });
//   };

//   const openImagePicker = () => {
//     const options = {
//       title: 'Select a Photo',
//       selectionLimit: 1,
//       mediaType: 'photo',
//       // storageOptions: {
//       //   skipBackup: true,
//       //   path: 'images',
//       // }
//     };

//     launchImageLibrary(options, response => {
//       if (response.didCancel) {
//         console.log('User cancelled image picker');
//       } else if (response.error) {
//         console.log('ImagePicker Error: ', response.error);
//       } else {
//         console.log(response.assets[0]);
//         const formData = new FormData();
//         // Append selected image to FormData
//         formData.append('image', {
//           uri: response.assets[0].uri,
//           type: response.assets[0].type,
//           name: response.assets[0].fileName,
//         });
//         formData.append('order_item_id', item.id);
//         console.log(formData);
//         dispatch(setLoader(true));
//         setSelectedCImage(response.assets[0].uri);

//         callNonTokenApiMP(config.apiName.attachImage, 'POST', formData)
//           .then(res => {
//             dispatch(setLoader(false));
//             if (res.status == 200) {
//               getCart();
//             } else {
//               setSelectedCImage(null);
//               Alert.alert('Error!', res.message);
//             }
//           })
//           .catch(err => {
//             dispatch(setLoader(false));
//             setSelectedCImage(null);
//             Alert.alert(t('serverError'));
//           });
//       }
//     });
//   };

//   const BottomSheetModal = ({visible, onClose}) => {
//     if (item.details?.gift_card) {
//       setFrom(item.details.gift_card.from);
//       setTo(item.details.gift_card.to);
//       setMsg(item.details.gift_card.message);
//     }

//     return (
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={visible}
//         onRequestClose={onClose}>
//         <TouchableOpacity
//           style={styles.modalContainer}
//           activeOpacity={1}
//           onPress={onClose}>
//           <View style={styles.modalContent}>
//             <Image source={{uri: whichImage}} style={styles.modalImg} />
//             <MyButton
//               label={t('back')}
//               btnColor={COLORS.secondary}
//               borderColor={COLORS.secondary}
//               txtColor={COLORS.white}
//               onPress={onClose}
//             />
//           </View>
//         </TouchableOpacity>
//       </Modal>
//     );
//   };

//   return (
//     <View style={globalStyles.whiteBg}>
//       <View style={globalStyles.rowView}>
//         <View style={[globalStyles.rowView, styles.tileHeight]}>
//           <View style={styles.leftView}>
//             <View style={styles.imgView}>
//               <Image
//                 source={{uri: item?.product.full_image}}
//                 style={styles.img}
//               />
//             </View>
//           </View>
//           <View style={styles.rightView}>
//             <View>
//               <Phrase
//                 txt={`${item?.product.name}`}
//                 txtStyle={styles.itemTitle}
//               />
//             </View>
//           </View>
//         </View>
//       </View>

//       <Hr />
//       <View style={[globalStyles.rowView, styles.wrapperOption]}>
//         <Phrase txt={t('Add Gift Wrapper')} />
//         <Switch
//           value={wrapperSwitch}
//           onValueChange={toggleWrapperSwitch}
//           color={COLORS.info}
//         />
//       </View>
//       {wrapperSwitch && (
//         <View>
//           {selectedWrapper == null ? (
//             <FlatList
//               horizontal={true}
//               data={wrappers}
//               renderItem={({item}) => (
//                 <React.Fragment key={item.id}>
//                   <TouchableOpacity
//                     onPress={() => {
//                       console.log(orderItemID);
//                       const formData = new FormData();
//                       formData.append('wrapper_id', item.id);
//                       formData.append('order_item_id', orderItemID);
//                       dispatch(setLoader(true));
//                       callNonTokenApiMP(
//                         config.apiName.attachWrapper,
//                         'POST',
//                         formData,
//                       )
//                         .then(res => {
//                           dispatch(setLoader(false));
//                           if (res.status == 200) {
//                             setSelectedWrapper(item.full_image);
//                             getCart();
//                           } else {
//                             Alert.alert('Error!', res.message);
//                           }
//                         })
//                         .catch(err => {
//                           dispatch(setLoader(false));
//                           Alert.alert(t('serverError'));
//                         });
//                     }}>
//                     <Image
//                       source={{uri: item.full_image}}
//                       style={styles.wrapperImg}
//                     />
//                   </TouchableOpacity>
//                 </React.Fragment>
//               )}
//               keyExtractor={item => item.id}
//             />
//           ) : (
//             <View style={globalStyles.rowView}>
//               <Image
//                 source={{uri: selectedWrapper}}
//                 style={styles.wrapperImg}
//               />
//               <View style={[globalStyles.rowView]}>
//                 <TouchableOpacity
//                   style={styles.viewImgContainer}
//                   onPress={() => {
//                     toggleModal();
//                     setWhichImage(selectedWrapper);
//                   }}>
//                   <Image source={eye} style={styles.optionImgView} />
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   onPress={() => {
//                     setSelectedWrapper(null);
//                   }}>
//                   <Image source={bin} style={styles.optionImg} />
//                 </TouchableOpacity>
//               </View>
//             </View>
//           )}
//           <Spacer />
//           {selectedCImage == null ? (
//             <>
//               <Phrase txt={t('addCustomImage')} />
//               <Spacer />
//               <Phrase
//                 txt={
//                   <Text style={styles.note}>
//                     {t('giftWrapperCustomImageUploadText')}{' '}
//                     <Text style={styles.noteSimple}>({t('optional')})</Text>
//                   </Text>
//                 }
//               />
//               <Spacer />

//               <TouchableOpacity
//                 style={styles.uploadContainer}
//                 onPress={openImagePicker}>
//                 <Image source={upload} style={styles.uploadImg} />
//                 <Phrase txt={t('clickToUpload')} txtStyle={styles.uploadTxt} />
//                 <Phrase txt={t('pngOrJpg')} txtStyle={styles.uploadDesc} />
//               </TouchableOpacity>
//             </>
//           ) : (
//             <View style={globalStyles.rowView}>
//               <Image source={{uri: selectedCImage}} style={styles.wrapperImg} />
//               <View style={[globalStyles.rowView]}>
//                 <TouchableOpacity
//                   style={styles.viewImgContainer}
//                   onPress={() => {
//                     toggleModal();
//                     setWhichImage(selectedCImage);
//                   }}>
//                   <Image source={eye} style={styles.optionImgView} />
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   onPress={() => {
//                     setSelectedCImage(null);
//                   }}>
//                   <Image source={bin} style={styles.optionImg} />
//                 </TouchableOpacity>
//               </View>
//             </View>
//           )}
//         </View>
//       )}
//       <Spacer />
//       <Hr type={'sm'} />
//       <View style={[globalStyles.rowView, styles.wrapperOption]}>
//         <Phrase txt={t('addGiftCard')} />
//         <Switch
//           value={cardSwitch}
//           onValueChange={toggleCardSwitch}
//           color={COLORS.info}
//         />
//       </View>
//       {cardSwitch && (
//         <>
//           <View style={globalStyles.rowView}>
//             <View style={{width: SIZES.fourtyFive}}>
//               <Input
//                 label={t('from')}
//                 placeholder={t('from')}
//                 value={from}
//                 setValue={setFrom}
//               />
//             </View>
//             <View style={{width: SIZES.fourtyFive}}>
//               <Input
//                 label={t('to')}
//                 placeholder={t('to')}
//                 value={to}
//                 setValue={setTo}
//               />
//             </View>
//           </View>
//           <Spacer />
//           <Input
//             label={t('message')}
//             placeholder={t('message')}
//             value={msg}
//             setValue={setMsg}
//           />
//           <Spacer />
//           <View style={globalStyles.row}>
//             <TouchableOpacity
//               onPress={() => {
//                 setCopy(!copy);
//               }}>
//               <Image
//                 source={copy ? checked : unchecked}
//                 style={styles.checkbox}
//               />
//             </TouchableOpacity>
//             <Phrase txt={t('copyMessageToOtherItems')} />
//           </View>
//           <Spacer />
//           <MyButton
//             label={t('addMessage')}
//             txtColor={COLORS.white}
//             btnColor={COLORS.secondary}
//             borderColor={COLORS.secondary}
//             onPress={addMessage}
//           />
//           <Spacer />
//         </>
//       )}
//       <Hr type={'sm'} />
//       <BottomSheetModal visible={modalVisible} onClose={toggleModal} />
//     </View>
//   );
// };

// export default WrapperItem;

// const styles = StyleSheet.create({
//   leftView: {width: SIZES.thirty, height: 80},
//   img: {width: 80, height: 80, resizeMode: 'cover'},
//   rightView: {
//     width: SIZES.seventy,
//     height: 80,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   imgView: {
//     width: 80,
//     height: 80,
//     borderWidth: 1,
//     borderColor: COLORS.grayLight,
//     borderRadius: SIZES.radius,
//     overflow: 'hidden',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   tileHeight: {height: 80},
//   wrapperOption: {
//     alignItems: 'center',
//     marginVertical: SIZES.padding,
//   },
//   note: {color: COLORS.black, ...FONTS.body4_bold},
//   noteSimple: {color: COLORS.black, ...FONTS.body4},
//   uploadContainer: {
//     height: 150,
//     width: SIZES.hundred,
//     borderWidth: 2,
//     borderColor: COLORS.bgGray,
//     borderRadius: SIZES.padding,
//     alignItems: 'center',
//     justifyContent: 'space-around',
//     paddingVertical: SIZES.radius,
//   },
//   uploadImg: {width: 40, height: 40, resizeMode: 'contain'},
//   uploadTxt: {...FONTS.body4_bold, color: COLORS.secondary},
//   uploadDesc: {color: COLORS.txtGray, ...FONTS.body4},
//   wrapperImg: {height: 100, width: 100, resizeMode: 'contain'},
//   modalImg: {height: 200, width: 200, resizeMode: 'contain'},
//   optionImgView: {
//     height: 20,
//     width: 20,
//     resizeMode: 'contain',
//     tintColor: COLORS.secondary,
//   },
//   optionImg: {height: 20, width: 20, resizeMode: 'contain'},
//   viewImgContainer: {marginRight: SIZES.radius},
//   checkbox: {
//     width: 20,
//     height: 20,
//     resizeMode: 'contain',
//     marginRight: SIZES.radius,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     padding: 20,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     alignItems: 'center',
//   },
//   closeButton: {
//     alignSelf: 'flex-end',
//     marginTop: 10,
//   },
//   closeButtonText: {
//     color: 'blue',
//     fontSize: 16,
//   },
// });


import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import globalStyles from '@constants/global-styles';
import {COLORS, SIZES, FONTS} from '@constants/theme';
import {Phrase, Hr, Spacer, Input, MyButton} from '@components';
import {Switch} from 'react-native-paper';
import {upload, eye, bin, checked, unchecked} from '@constants/icons';
import {useDispatch, useSelector} from 'react-redux';
import {launchImageLibrary} from 'react-native-image-picker';
import {callNonTokenApi, callNonTokenApiMP} from '../../helpers/ApiRequest';
import config from '../../constants/config';
import {
  setLoader,
  suppressOrderItemCustomImage,
  clearOrderItemCustomImageSuppressed,
  setOrderItemGiftWrapperMode,
} from '../../store/reducers/global';
import {useTranslation} from 'react-i18next';

/** Restore wrapper preview URL from cart `wrapper_id` + catalog, or API fields on `details`. */
function resolveWrapperImageUri(orderItem, allWrappers) {
  const rawId = orderItem?.details?.wrapper_id;
  if (rawId === undefined || rawId === null || rawId === '') {
    return null;
  }
  const list = Array.isArray(allWrappers) ? allWrappers : [];
  const found = list.find(w => String(w.id) === String(rawId));
  if (found?.full_image) {
    return found.full_image;
  }
  return (
    orderItem?.details?.wrapper_image ??
    orderItem?.details?.wrapper_full_image ??
    null
  );
}

const WrapperItem = ({item, getCart}) => {
  const {t} = useTranslation();
  const global = useSelector(state => state.global);
  const allWrappers = global.allWrappers;
  const customImageSuppressed = useSelector(
    s => s.global.orderItemCustomImageSuppressed?.[String(item.id)],
  );
  const giftWrapperMode = useSelector(
    s => s.global.orderItemGiftWrapperMode?.[String(item.id)],
  );
  const dispatch = useDispatch();
  const [wrapperSwitch, setWrapperSwitch] = useState(false);
  const [cardSwitch, setCardSwitch] = useState(false);
  const [orderItemID, setOrderItemId] = useState(item.id);
  const [selectedWrapper, setSelectedWrapper] = useState(null);
  const [selectedCImage, setSelectedCImage] = useState(null);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [msg, setMsg] = useState('');
  const [copy, setCopy] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [whichImage, setWhichImage] = useState(null);

  useEffect(() => {
    const wId = item?.details?.wrapper_id;
    const hasServerWrapper =
      wId !== undefined && wId !== null && wId !== '';

    if (giftWrapperMode === 'off') {
      setWrapperSwitch(false);
      setSelectedWrapper(null);
    } else if (giftWrapperMode === 'cleared') {
      setWrapperSwitch(true);
      setSelectedWrapper(null);
    } else {
      setWrapperSwitch(!!hasServerWrapper);
      setSelectedWrapper(resolveWrapperImageUri(item, allWrappers));
    }

    setSelectedCImage(
      customImageSuppressed
        ? null
        : (item?.details?.full_image ?? null),
    );

    if (item.details?.gift_card) {
      setFrom(item.details.gift_card.from ?? '');
      setTo(item.details.gift_card.to ?? '');
      setMsg(item.details.gift_card.message ?? '');
      setCardSwitch(true);
    } else {
      setCardSwitch(false);
    }
  }, [
    item.id,
    item.details?.wrapper_id,
    item.details?.full_image,
    item.details?.gift_card?.from,
    item.details?.gift_card?.to,
    item.details?.gift_card?.message,
    allWrappers,
    customImageSuppressed,
    giftWrapperMode,
  ]);

  const hasOutdoorCategory = () => {
    // Handle both categories array and category_id fallback
    if (item?.product?.categories && item?.product?.categories.length > 0) {
      return item.product.categories.some(category => category == '10');
    }
    return item?.product?.category_id == '10';
  };

  const hasPartyCategory = () => {
    if (item?.product?.categories && item?.product?.categories.length > 0) {
      return item.product.categories.some(category => category == '15');
    }
    return item?.product?.category_id == '15';
  };

  const hasCakesCategory = () => {
    if (item?.product?.categories && item?.product?.categories.length > 0) {
      return item.product.categories.some(category => 
        ['11', '12', '13', '14'].includes(category)
      );
    }
    return ['11', '12', '13', '14'].includes(item?.product?.category_id);
  };

  // Updated logic: Hide gift wrapper only for outdoor and cakes categories
  const shouldHideGiftWrapper = hasOutdoorCategory() || hasCakesCategory();

  // Debug logging
  console.log('Product categories:', item?.product?.categories);
  console.log('Product category_id:', item?.product?.category_id);
  console.log('Has outdoor:', hasOutdoorCategory());
  console.log('Has cakes:', hasCakesCategory());
  console.log('Should hide wrapper:', shouldHideGiftWrapper);
  const toggleModal = () => setModalVisible(!modalVisible);

  const onGiftWrapperToggle = value => {
    if (!value) {
      dispatch(setOrderItemGiftWrapperMode({orderItemId: item.id, mode: 'off'}));
      setWrapperSwitch(false);
      setSelectedWrapper(null);
    } else {
      dispatch(
        setOrderItemGiftWrapperMode({orderItemId: item.id, mode: 'cleared'}),
      );
      setWrapperSwitch(true);
      setSelectedWrapper(null);
    }
  };

  const removeGiftWrapperSelection = () => {
    dispatch(
      setOrderItemGiftWrapperMode({orderItemId: item.id, mode: 'cleared'}),
    );
    setSelectedWrapper(null);
    setWrapperSwitch(true);
  };

  const toggleCardSwitch = () => setCardSwitch(!cardSwitch);

  const addMessage = async () => {
    if (!to || !from || !msg) return;
    dispatch(setLoader(true));
    callNonTokenApi(config.apiName.attachGiftCard, 'POST', {
      from,
      to,
      message: msg,
      copy,
      order_item_id: item.id,
    })
      .then(res => {
        dispatch(setLoader(false));
        if (res.status == 200) {
          getCart();
        } else {
          Alert.alert('Error!', res.message);
        }
      })
      .catch(() => {
        dispatch(setLoader(false));
        Alert.alert(t('serverError'));
      });
  };

  const openImagePicker = () => {
    const options = {
      title: 'Select a Photo',
      selectionLimit: 1,
      mediaType: 'photo',
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) return;
      if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        return;
      }
      const file = response.assets?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('image', {
        uri: file.uri,
        type: file.type,
        name: file.fileName,
      });
      formData.append('order_item_id', item.id);

      dispatch(setLoader(true));
      setSelectedCImage(file.uri);

      callNonTokenApiMP(config.apiName.attachImage, 'POST', formData)
        .then(res => {
          dispatch(setLoader(false));
          if (res.status == 200) {
            dispatch(clearOrderItemCustomImageSuppressed(item.id));
            getCart();
          } else {
            setSelectedCImage(null);
            Alert.alert('Error!', res.message);
          }
        })
        .catch(() => {
          dispatch(setLoader(false));
          setSelectedCImage(null);
          Alert.alert(t('serverError'));
        });
    });
  };

  /** No delete API: hide the image in UI and exclude it from local totals until a new image is attached. */
  const removeCustomImage = () => {
    dispatch(suppressOrderItemCustomImage(item.id));
    setSelectedCImage(null);
  };

  const BottomSheetModal = ({visible, onClose}) => {
    return (
      <Modal
        animationType="slide"
        transparent
        visible={visible}
        onRequestClose={onClose}>
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={onClose}>
          <View style={styles.modalContent}>
            <Image source={{uri: whichImage}} style={styles.modalImg} />
            <MyButton
              label={t('back')}
              btnColor={COLORS.secondary}
              borderColor={COLORS.secondary}
              txtColor={COLORS.white}
              onPress={onClose}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <View style={globalStyles.whiteBg}>
      <View style={globalStyles.rowView}>
        <View style={[globalStyles.rowView, styles.tileHeight]}>
          <View style={styles.leftView}>
            <View style={styles.imgView}>
              <Image
                source={{uri: item?.product.full_image}}
                style={styles.img}
              />
            </View>
          </View>
          <View style={styles.rightView}>
            <Phrase txt={`${item?.product.name}`} txtStyle={styles.itemTitle} />
          </View>
        </View>
      </View>

      <Hr />
      {!shouldHideGiftWrapper && (
        <>
          <View style={[globalStyles.rowView, styles.wrapperOption]}>
            <Phrase txt={t('Add Gift Wrapper')} />
            <Switch
              value={wrapperSwitch}
              onValueChange={onGiftWrapperToggle}
              color={COLORS.info}
            />
          </View>
          {wrapperSwitch && (
            <View>
              {selectedWrapper == null ? (
                <FlatList
                  horizontal
                  data={allWrappers}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => {
                        const formData = new FormData();
                        formData.append('wrapper_id', item.id);
                        formData.append('order_item_id', orderItemID);
                        dispatch(setLoader(true));
                        callNonTokenApiMP(
                          config.apiName.attachWrapper,
                          'POST',
                          formData,
                        )
                          .then(res => {
                            dispatch(setLoader(false));
                            if (res.status == 200) {
                              dispatch(
                                setOrderItemGiftWrapperMode({
                                  orderItemId: orderItemID,
                                  mode: null,
                                }),
                              );
                              setSelectedWrapper(item.full_image);
                              getCart();
                            } else {
                              Alert.alert('Error!', res.message);
                            }
                          })
                          .catch(() => {
                            dispatch(setLoader(false));
                            Alert.alert(t('serverError'));
                          });
                      }}>
                      <Image
                        source={{uri: item.full_image}}
                        style={styles.wrapperImg}
                      />
                    </TouchableOpacity>
                  )}
                  keyExtractor={item => item.id}
                />
              ) : (
                <View style={globalStyles.rowView}>
                  <Image
                    source={{uri: selectedWrapper}}
                    style={styles.wrapperImg}
                  />
                  <View style={[globalStyles.rowView]}>
                    <TouchableOpacity
                      style={styles.viewImgContainer}
                      onPress={() => {
                        toggleModal();
                        setWhichImage(selectedWrapper);
                      }}>
                      <Image source={eye} style={styles.optionImgView} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={removeGiftWrapperSelection}>
                      <Image source={bin} style={styles.optionImg} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              <Spacer />
              {selectedCImage == null ? (
                <>
                  <Phrase txt={t('addCustomImage')} />
                  <Spacer />
                  <Phrase
                    txt={
                      <Text style={styles.note}>
                        {t('giftWrapperCustomImageUploadText')}{' '}
                        <Text style={styles.noteSimple}>
                          ({t('optional')})
                        </Text>
                      </Text>
                    }
                  />
                  <Spacer />
                  <TouchableOpacity
                    style={styles.uploadContainer}
                    onPress={openImagePicker}>
                    <Image source={upload} style={styles.uploadImg} />
                    <Phrase
                      txt={t('clickToUpload')}
                      txtStyle={styles.uploadTxt}
                    />
                    <Phrase
                      txt={t('pngOrJpg')}
                      txtStyle={styles.uploadDesc}
                    />
                  </TouchableOpacity>
                </>
              ) : (
                <View style={globalStyles.rowView}>
                  <Image
                    source={{uri: selectedCImage}}
                    style={styles.wrapperImg}
                  />
                  <View style={[globalStyles.rowView]}>
                    <TouchableOpacity
                      style={styles.viewImgContainer}
                      onPress={() => {
                        toggleModal();
                        setWhichImage(selectedCImage);
                      }}>
                      <Image source={eye} style={styles.optionImgView} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={removeCustomImage}>
                      <Image source={bin} style={styles.optionImg} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}
        </>
      )}
      <Spacer />
      <Hr type={'sm'} />
      <View style={[globalStyles.rowView, styles.wrapperOption]}>
        <Phrase txt={t('addGiftCard')} />
        <Switch
          value={cardSwitch}
          onValueChange={toggleCardSwitch}
          color={COLORS.info}
        />
      </View>
      {cardSwitch && (
        <>
          <View style={globalStyles.rowView}>
            <View style={{width: SIZES.fourtyFive}}>
              <Input
                label={t('from')}
                placeholder={t('from')}
                value={from}
                setValue={setFrom}
              />
            </View>
            <View style={{width: SIZES.fourtyFive}}>
              <Input
                label={t('to')}
                placeholder={t('to')}
                value={to}
                setValue={setTo}
              />
            </View>
          </View>
          <Spacer />
          <Input
            label={t('message')}
            placeholder={t('message')}
            value={msg}
            setValue={setMsg}
          />
          <Spacer />
          <View style={globalStyles.row}>
            <TouchableOpacity onPress={() => setCopy(!copy)}>
              <Image
                source={copy ? checked : unchecked}
                style={styles.checkbox}
              />
            </TouchableOpacity>
            <Phrase txt={t('copyMessageToOtherItems')} />
          </View>
          <Spacer />
          <MyButton
            label={t('addMessage')}
            txtColor={COLORS.white}
            btnColor={COLORS.secondary}
            borderColor={COLORS.secondary}
            onPress={addMessage}
          />
          <Spacer />
        </>
      )}
      <Hr type={'sm'} />
      <BottomSheetModal visible={modalVisible} onClose={toggleModal} />
    </View>
  );
};

export default WrapperItem;

const styles = StyleSheet.create({
  leftView: {width: SIZES.thirty, height: 80},
  img: {width: 80, height: 80, resizeMode: 'cover'},
  rightView: {
    width: SIZES.seventy,
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imgView: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileHeight: {height: 80},
  wrapperOption: {
    alignItems: 'center',
    marginVertical: SIZES.padding,
  },
  note: {color: COLORS.black, ...FONTS.body4_bold},
  noteSimple: {color: COLORS.black, ...FONTS.body4},
  uploadContainer: {
    height: 150,
    width: SIZES.hundred,
    borderWidth: 2,
    borderColor: COLORS.bgGray,
    borderRadius: SIZES.padding,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: SIZES.radius,
  },
  uploadImg: {width: 40, height: 40, resizeMode: 'contain'},
  uploadTxt: {...FONTS.body4_bold, color: COLORS.secondary},
  uploadDesc: {color: COLORS.txtGray, ...FONTS.body4},
  wrapperImg: {height: 100, width: 100, resizeMode: 'contain'},
  modalImg: {height: 200, width: 200, resizeMode: 'contain'},
  optionImgView: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    tintColor: COLORS.secondary,
  },
  optionImg: {height: 20, width: 20, resizeMode: 'contain'},
  viewImgContainer: {marginRight: SIZES.radius},
  checkbox: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: SIZES.radius,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  closeButtonText: {
    color: 'blue',
    fontSize: 16,
  },
});
