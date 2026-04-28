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
import React, {useState, useEffect, useCallback} from 'react';
import globalStyles from '@constants/global-styles';
import {COLORS, SIZES, FONTS} from '@constants/theme';
import {Phrase, Hr, Spacer, Input, MyButton} from '@components';
import {Switch} from 'react-native-paper';
import {upload, eye, bin, checked, unchecked} from '@constants/icons';
import {useDispatch, useSelector} from 'react-redux';
import {launchImageLibrary} from 'react-native-image-picker';
import {callNonTokenApi, callNonTokenApiMP} from '../../helpers/ApiRequest';
import config from '../../constants/config';
import {setLoader} from '../../store/reducers/global';
import {useTranslation} from 'react-i18next';

/** True when this catalog id is NONE / zero-price (no paid wrap). */
function isWrapperFreeByCatalog(wrapperId, wrappers) {
  if (wrapperId == null || wrapperId === '') {
    return true;
  }
  const row = wrappers?.find(w => String(w.id) === String(wrapperId));
  if (!row) {
    return false;
  }
  const label = `${row.name ?? row.title ?? row.label ?? ''}`.trim();
  const img = `${row.full_image ?? ''}`.toLowerCase();
  if (/^none$/i.test(label) || /\bnone\b/i.test(label) || img.includes('none')) {
    return true;
  }
  const p = parseFloat(
    row.price ?? row.amount ?? row.wrapper_price ?? row.cost ?? NaN,
  );
  return !Number.isNaN(p) && p === 0;
}

/** Catalog row that means “no paid wrap” — attach when user turns wrapper off or clears selection. */
function findNoCostWrapperOption(wrappers) {
  if (!Array.isArray(wrappers) || wrappers.length === 0) {
    return null;
  }
  const byLabel = wrappers.find(w => {
    const label = `${w.name ?? w.title ?? w.label ?? ''}`.trim();
    if (/^none$/i.test(label) || /\bnone\b/i.test(label)) {
      return true;
    }
    const img = `${w.full_image ?? ''}`.toLowerCase();
    return img.includes('none');
  });
  if (byLabel) {
    return byLabel;
  }
  return (
    wrappers.find(w => {
      const p = parseFloat(
        w.price ?? w.amount ?? w.wrapper_price ?? w.cost ?? NaN,
      );
      return !Number.isNaN(p) && p === 0;
    }) || null
  );
}

const WrapperItem = ({
  item,
  getCart,
  resumeGiftWrapUi = false,
  onGiftWrapAttached,
}) => {
  const {t} = useTranslation();
  const global = useSelector(state => state.global);
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
  const handleCardSwitch = next => {
    setCardSwitch(next);
    if (next) {
      setFrom('');
      setTo('');
      setMsg('');
      setCopy(false);
    }
  };

  const wrappers = global.allWrappers;

  useEffect(() => {
    if (!resumeGiftWrapUi) {
      return;
    }
    const wid = item.details?.wrapper_id;
    const hasAttached =
      wid != null && wid !== '' && String(wid) !== '0' && Number(wid) !== 0;

    if (!hasAttached) {
      setSelectedWrapper(null);
      return;
    }

    const freeWrapper = isWrapperFreeByCatalog(wid, wrappers);
    setWrapperSwitch(!freeWrapper);

    const fromApi =
      item.details?.wrapper_image ??
      item.details?.wrapper_full_image ??
      item.details?.wrapper_uri;
    if (fromApi) {
      setSelectedWrapper(fromApi);
      return;
    }
    const row = wrappers?.find(w => String(w.id) === String(wid));
    if (row?.full_image) {
      setSelectedWrapper(row.full_image);
    }
  }, [
    resumeGiftWrapUi,
    item.details?.wrapper_id,
    item.details?.wrapper_image,
    item.details?.wrapper_full_image,
    item.id,
    wrappers,
  ]);

  useEffect(() => {
    if (item.details?.full_image) {
      setSelectedCImage(item.details.full_image);
    }
  }, [item.details?.full_image]);

  useEffect(() => {
    if (!resumeGiftWrapUi || !item.details?.gift_card) {
      return;
    }
    const gc = item.details.gift_card;
    setFrom(gc.from != null ? String(gc.from) : '');
    setTo(gc.to != null ? String(gc.to) : '');
    setMsg(gc.message != null ? String(gc.message) : '');
    setCopy(!!gc.copy);
    setCardSwitch(true);
  }, [resumeGiftWrapUi, item.id, item.details?.gift_card]);

  const attachWrapperByCatalogRow = useCallback(
    (row, onFailure, resetPickerAfterSuccess = false) => {
      if (!row) {
        return;
      }
      const formData = new FormData();
      formData.append('wrapper_id', row.id);
      formData.append('order_item_id', orderItemID);
      dispatch(setLoader(true));
      callNonTokenApiMP(config.apiName.attachWrapper, 'POST', formData)
        .then(res => {
          dispatch(setLoader(false));
          if (res.status == 200) {
            // After delete/clear we attach NONE server-side but show the horizontal picker again.
            setSelectedWrapper(resetPickerAfterSuccess ? null : row.full_image ?? null);
            onGiftWrapAttached?.();
            getCart();
          } else {
            Alert.alert('Error!', res.message);
            onFailure?.();
          }
        })
        .catch(() => {
          dispatch(setLoader(false));
          Alert.alert(t('serverError'));
          onFailure?.();
        });
    },
    [dispatch, getCart, onGiftWrapAttached, orderItemID, t],
  );

  const clearWrapperOnServer = useCallback(() => {
    const noneRow = findNoCostWrapperOption(wrappers);
    if (noneRow) {
      attachWrapperByCatalogRow(noneRow, () => setWrapperSwitch(true), true);
      return;
    }
    Alert.alert(t('error'), t('selectNoneWrapperToClear'));
    setWrapperSwitch(true);
  }, [attachWrapperByCatalogRow, t, wrappers]);

  const handleWrapperSwitch = next => {
    if (next) {
      setWrapperSwitch(true);
      return;
    }
    setWrapperSwitch(false);
    clearWrapperOnServer();
  };

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
              onValueChange={handleWrapperSwitch}
              color={COLORS.info}
            />
          </View>
          {wrapperSwitch && (
            <View>
              {selectedWrapper == null ? (
                <FlatList
                  horizontal
                  data={wrappers}
                  renderItem={({item: wrapperRow}) => (
                    <TouchableOpacity
                      key={wrapperRow.id}
                      onPress={() => attachWrapperByCatalogRow(wrapperRow)}>
                      <Image
                        source={{uri: wrapperRow.full_image}}
                        style={styles.wrapperImg}
                      />
                    </TouchableOpacity>
                  )}
                  keyExtractor={wrapperRow => String(wrapperRow.id)}
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
                    <TouchableOpacity onPress={clearWrapperOnServer}>
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
                    <TouchableOpacity onPress={() => setSelectedCImage(null)}>
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
          onValueChange={handleCardSwitch}
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
