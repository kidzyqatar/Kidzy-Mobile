import {View, Text, Image, FlatList, Pressable, Alert} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
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
import {LanguageContext} from '../../store/LanguageContext';
import {getLocalizedName, getLocalizedDescription} from '../../helpers/localizedEntity';

const decodeHtmlEntities = input => {
  if (input == null) return '';
  const str = String(input);
  return str
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => {
      const n = Number(code);
      return Number.isFinite(n) ? String.fromCharCode(n) : _;
    })
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
      const n = parseInt(hex, 16);
      return Number.isFinite(n) ? String.fromCharCode(n) : _;
    });
};

const htmlToPlainText = input => {
  if (input == null) return '';
  let s = String(input);

  // API sometimes sends literal "\n" sequences.
  s = s.replace(/\\n/g, '\n');

  // Convert common HTML line breaks/blocks into newlines before stripping tags.
  s = s
    .replace(/<\s*br\s*\/?\s*>/gi, '\n')
    .replace(/<\/\s*p\s*>/gi, '\n')
    .replace(/<\/\s*div\s*>/gi, '\n')
    .replace(/<\/\s*li\s*>/gi, '\n');

  // Strip remaining tags.
  s = s.replace(/<[^>]*>/g, '');

  // Decode entities and normalize whitespace.
  s = decodeHtmlEntities(s)
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return s;
};

const ProductDetail = ({route}) => {
  const {t} = useTranslation();
  const {language} = useContext(LanguageContext);
  const global = useSelector(state => state.global);
  const dispatch = useDispatch();
  const {item} = route.params;
  const [item1, setItem1] = useState(item);
  const [newArrivals, setNewArrivals] = useState([]);
  const [otherImages, setOtherImages] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [bigImage, setBigImage] = useState(item.full_image);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  useEffect(() => {
    dispatch(setLoader(true));
    fetchData();
  }, []);

  const addItemTocart = async () => {
    if (isLoading) return; // Prevent multiple calls
    
    console.log(quantity);
    setIsLoading(true); // Set local loading state
    dispatch(setLoader(true));
  
    try {
      const res = await callNonTokenApi(`${config.apiName.addToCart}`, 'POST', {
        product_id: item.id,
        guest_session_id: global.cart_session_id,
        quantity: quantity,
      });
      
      if (res.status == 200) {
        const cartRes = await callNonTokenApi(
          `${config.apiName.getCart}/${global.cart_session_id}`,
          'GET',
        );
        
        if (cartRes.status == 200) {
          dispatch(setCart(cartRes.data.cart));
        }
      }
    } catch (error) {
      console.log(error);
      Alert.alert(t('error'), t('failedToAddToCart'));
    } finally {
      setIsLoading(false); // Reset loading state
      dispatch(setLoader(false));
    }
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
        Alert.alert(t('error'), t('somethingWentWrong'));
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

  const product = item1;
  const title = getLocalizedName(product, language);
  const descSource = getLocalizedDescription(product, language);

  return (
    <MasterLayout bgColor={COLORS.bgGray} scrolling={true} max={true}>
      <View style={globalStyles.whiteBg}>
        {/* <TouchableOpacity
          onPress={() => {
            RootNavigation.back();
          }}>
          <Image source={back} style={styles.backImg} />
        </TouchableOpacity> */}
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
            <Phrase txt={title} txtStyle={styles.heading} />
            <Phrase txt={`QAR ${product.price}`} txtStyle={styles.price} />
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
        <Phrase txt={htmlToPlainText(descSource)} txtStyle={styles.descTxt} />

        <MyButton
          label={<Text style={styles.productBtn}>{t('addToCart')}</Text>}
          btnStyle={[styles.btnStyle, isLoading && {opacity: 0.6}]}
          txtColor={COLORS.white}
          btnColor={COLORS.secondary}
          borderColor={COLORS.secondary}
          icon={btnCartWhite}
          iconPosition={'right'}
          onPress={addItemTocart}
          disabled={isLoading} // Add disabled prop
        />
      </View>
      <Spacer />
      <View style={globalStyles.whiteBg}>
        <CartBar title={t('exploreMore')} showCart={false} />
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
