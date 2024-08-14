import {View, Text, Image, FlatList, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  MasterLayout,
  CartBar,
  Spacer,
  Phrase,
  MyButton,
  ProductWidget,
} from '@components';
import {COLORS} from '@constants/theme';
import globalStyles from '@constants/global-styles';
import {back, btnCartWhite, minus, plus} from '@constants/icons';
import {product1} from '@constants/images';
import {SIZES, FONTS} from '@constants/theme';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {styles} from './styles';
import config from '../../constants/config';
import {callNonTokenApi} from '../../helpers/ApiRequest';
import {useDispatch, useSelector} from 'react-redux';
import {setCart, setLoader} from '../../store/reducers/global';
import * as RootNavigation from '@navigators/RootNavigation';
import {useTranslation} from 'react-i18next';

const ProductDetail = ({route}) => {
  const {t} = useTranslation();
  const global = useSelector(state => state.global);
  const dispatch = useDispatch();
  const {item} = route.params;
  const [item1, setItem1] = useState(item);
  const [newArrivals, setNewArrivals] = useState([]);
  const [otherImages, setOtherImages] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [bigImage, setBigImage] = useState(item.full_image);

  useEffect(() => {
    dispatch(setLoader(true));
    fetchData();
  }, []);

  const addItemTocart = async () => {
    console.log(quantity);
    dispatch(setLoader(true));

    callNonTokenApi(`${config.apiName.addToCart}`, 'POST', {
      product_id: item.id,
      guest_session_id: global.cart_session_id,
      quantity: quantity,
    })
      .then(res => {
        dispatch(setCart(res.data));
        callNonTokenApi(
          `${config.apiName.getCart}/${global.cart_session_id}`,
          'GET',
        )
          .then(res => {
            dispatch(setLoader(false));

            console.log(res.data.cart.order_items.length);
            dispatch(setCart(res.data.cart));
          })
          .catch(error => {
            dispatch(setLoader(false));

            console.log(error);
            setApiFailModal(true);
          });
      })
      .catch(error => {
        dispatch(setLoader(false));

        console.log(error);
        setApiFailModal(true);
      });
  };

  const fetchData = async () => {
    dispatch(setLoader(true));
    console.log(`${config.apiName.details}/${item.slug}`);
    callNonTokenApi(`${config.apiName.details}/${item.slug}`, 'GET')
      .then(res => {
        dispatch(setLoader(false));

        setOtherImages(res.data.product.other_images);
        console.log('details', res.data.product.other_images.length);
        setItem1(res.data.product);
        setBigImage(res.data.product.full_image);
        setNewArrivals(res.data.similarProducts);
      })
      .catch(error => {
        dispatch(setLoader(false));
        console.log(error);
        setApiFailModal(true);
      });
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
    console.log(quantity);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      console.log(quantity);
    }
  };

  const SwapImage = index => {
    const temp = otherImages[index];
    otherImages[index] = bigImage;
    setBigImage(temp);
  };

  return (
    <MasterLayout bgColor={COLORS.bgGray} scrolling={true} max={true}>
      <View style={globalStyles.whiteBg}>
        <TouchableOpacity
          onPress={() => {
            RootNavigation.back();
          }}>
          <Image source={back} style={styles.backImg} />
        </TouchableOpacity>
        <Spacer />
        <CartBar title={t('productDetails')} />
      </View>
      <Spacer />
      <View style={styles.mainImgView}>
        <Image source={{uri: bigImage}} style={styles.mainImg} />
      </View>
      <Spacer />
      {otherImages.length > 0 ? (
        <View style={styles.otherImgView}>
          <FlatList
            scrollEnabled={false}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={otherImages}
            renderItem={({item, index}) => (
              <React.Fragment key={item}>
                <Pressable onPress={() => SwapImage(index)}>
                  <Image source={{uri: item}} style={styles.otherImg} />
                </Pressable>
              </React.Fragment>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      ) : null}
      <Spacer />
      <View style={styles.content}>
        <View style={[globalStyles.rowView]}>
          <View style={styles.headingView}>
            <Phrase txt={item.name} txtStyle={styles.heading} />
            <Phrase txt={`QAR ${item.price}`} txtStyle={styles.price} />
          </View>
          <View style={styles.calcView}>
            <TouchableOpacity
              onPress={() => {
                decrementQuantity();
              }}>
              <Image source={minus} style={styles.calcImg} />
            </TouchableOpacity>
            <Phrase txt={quantity} txtStyle={styles.calcTxt} />
            <TouchableOpacity
              onPress={() => {
                incrementQuantity();
              }}>
              <Image source={plus} style={styles.calcImg} />
            </TouchableOpacity>
          </View>
        </View>
        <Spacer />
        <Phrase txt={t('description')} txtStyle={styles.descHeading} />
        <Phrase txt={item.description} txtStyle={styles.descTxt} />

        <MyButton
          label={<Text style={styles.productBtn}>{t('addToCart')}</Text>}
          btnStyle={styles.btnStyle}
          txtColor={COLORS.white}
          btnColor={COLORS.secondary}
          borderColor={COLORS.secondary}
          icon={btnCartWhite}
          iconPosition={'right'}
          onPress={addItemTocart}
        />
      </View>
      <Spacer />
      <View style={globalStyles.whiteBg}>
        <CartBar title={'Explore More'} showCart={false} />
        <FlatList
          data={newArrivals}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <React.Fragment key={item.id}>
              <ProductWidget item={item} />
            </React.Fragment>
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={{alignItems: 'center'}}
        />
      </View>
    </MasterLayout>
  );
};

export default ProductDetail;
