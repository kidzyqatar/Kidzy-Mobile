import {StyleSheet, Image, View, TouchableOpacity, Alert} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  MasterLayout,
  BackBar,
  Phrase,
  Spacer,
  Hr,
  MyButton,
  OrderItem,
  Chip,
} from '@components';
import {COLORS, SIZES, FONTS} from '@constants/theme';
import globalStyles from '@constants/global-styles';
import {bin, plus, minus} from '@constants/icons';
import {useDispatch, useSelector} from 'react-redux';
import {setCart, setLoader} from '../../store/reducers/global';
import config from '../../constants/config';
import {callNonTokenApi} from '../../helpers/ApiRequest';

const CartItem = ({item}) => {
  const global = useSelector(state => state.global);
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);

  // Sync local quantity with cart item quantity
  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);

  const deleteItemFromCart = async () => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    dispatch(setLoader(true));
    
    try {
      const res = await callNonTokenApi(`${config.apiName.deleteItemFromCart}`, 'POST', {
        id: item.id,
      });
      
      dispatch(setLoader(false));
      setIsUpdating(false);
      
      if (res.status == 200) {
        await getCart();
      } else {
        Alert.alert('Error!', res.message);
      }
    } catch (error) {
      dispatch(setLoader(false));
      setIsUpdating(false);
      console.log('Delete error:', error);
      Alert.alert('Error', 'Failed to delete item from cart');
    }
  };

  const getCart = async () => {
    dispatch(setLoader(true));
    
    try {
      const res = await callNonTokenApi(
        `${config.apiName.getCart}/${global.cart_session_id}`,
        'GET',
      );
      
      dispatch(setLoader(false));
      
      if (res.status == 200) {
        console.log('Cart items count:', res.data.cart.order_items.length);
        console.log('Updated cart:', res.data.cart);
        dispatch(setCart(res.data.cart));
      } else {
        Alert.alert('Error!', res.message);
      }
    } catch (error) {
      dispatch(setLoader(false));
      console.log('Get cart error:', error);
      Alert.alert('Error', 'Failed to refresh cart');
    }
  };

  const addItemTocart = async (newQuantity) => {
    if (isUpdating) return;
    
    console.log('🔄 Updating quantity from', item.quantity, 'to', newQuantity);
    setIsUpdating(true);
    dispatch(setLoader(true));
    
    try {
      // First, delete the current item completely
      const deleteRes = await callNonTokenApi(`${config.apiName.deleteItemFromCart}`, 'POST', {
        id: item.id,
      });
      
      if (deleteRes.status !== 200) {
        throw new Error('Failed to delete item');
      }
      
      // Then add it back with the exact new quantity
      const addRes = await callNonTokenApi(`${config.apiName.addToCart}`, 'POST', {
        product_id: item.product_id,
        guest_session_id: global.cart_session_id,
        quantity: parseInt(newQuantity),
      });
      
      dispatch(setLoader(false));
      setIsUpdating(false);
      
      if (addRes.status == 200) {
        console.log('✅ Quantity set precisely to:', newQuantity);
        await getCart();
      } else {
        Alert.alert('Error!', addRes.message);
        // Revert quantity on error
        setQuantity(item.quantity);
      }
    } catch (error) {
      dispatch(setLoader(false));
      setIsUpdating(false);
      console.log('❌ Precise update error:', error);
      Alert.alert('Error', 'Failed to update quantity');
      // Revert quantity on error
      setQuantity(item.quantity);
    }
  };

  const incrementQuantity = () => {
    if (isUpdating) return;
    
    const newQuantity = quantity + 1;
    console.log('➕ Incrementing to:', newQuantity);
    setQuantity(newQuantity); // Optimistic update
    addItemTocart(newQuantity);
  };

  const decrementQuantity = () => {
    if (isUpdating) return;
    
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      console.log('➖ Decrementing to:', newQuantity);
      setQuantity(newQuantity); // Optimistic update
      addItemTocart(newQuantity);
    } else {
      // If quantity is 1, delete the item
      console.log('🗑️ Deleting item (quantity would be 0)');
      deleteItemFromCart();
    }
  };

  return (
    <View style={[globalStyles.rowView, styles.tileHeight]}>
      <View style={styles.leftView}>
        <View style={styles.imgView}>
          <Image source={{uri: item?.product.full_image}} style={styles.img} />
        </View>
      </View>
      <View style={styles.rightView}>
        <View style={{flex: 1}}>
          <Phrase
            txt={`${item.product.name}`}
            txtStyle={styles.itemTitle}
            numberOfLines={2}
          />
          <Phrase
            txt={`QAR ${(item.product.price * quantity).toFixed(2)}`}
            txtStyle={styles.itemPrice}
          />
          <View style={styles.calcView}>
            <TouchableOpacity
              onPress={decrementQuantity}
              disabled={isUpdating}
              style={[isUpdating && {opacity: 0.5}]}>
                <View style={{padding:10,paddingHorizontal:25}}>
                <Image source={minus} style={styles.calcImg} />
                </View>
             
            </TouchableOpacity>
            <Phrase txt={quantity.toString()} txtStyle={styles.calcTxt} />
            <TouchableOpacity
              onPress={incrementQuantity}
              disabled={isUpdating}
              style={[isUpdating && {opacity: 0.5}]}>
                <View style={{padding:10,paddingHorizontal:25}}>
                <Image source={plus} style={styles.calcImg} />
                </View>
              
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity 
          onPress={deleteItemFromCart}
          disabled={isUpdating}
          style={[isUpdating && {opacity: 0.5}]}>
          <Image source={bin} style={styles.binImage} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartItem;

const styles = StyleSheet.create({
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
  tileHeight: {height: 100},
  leftView: {width: SIZES.thirty, height: 80},
  img: {width: 80, height: 80, resizeMode: 'cover'},
  rightView: {
    width: SIZES.seventy,
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  binImage: {width: 15, height: 15, resizeMode: 'contain'},
  itemTitle: {...FONTS.body5, color: COLORS.black},
  itemPrice: {...FONTS.body4_bold, color: COLORS.black},
  calcView: {
    width: SIZES.seventy,
    backgroundColor: COLORS.white,
    height: 35,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    borderRadius: SIZES.radius,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: SIZES.minor,
  },
  calcImg: {width: 15, height: 15, resizeMode: 'contain'},
  calcTxt: {...FONTS.body3},
});
