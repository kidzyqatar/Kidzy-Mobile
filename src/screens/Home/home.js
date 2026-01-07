import React, { useEffect, useState, useContext, useRef } from 'react';
import {
  Text,
  View,
  Image,
  ImageBackground,
  Pressable,
  FlatList,
  TouchableOpacity,
  Alert,
  Switch,
  StatusBar,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SIZES } from '@constants/theme';
import {
  MasterLayout,
  Phrase,
  Input,
  Heading,
  CategoryTile,
  CategoryWidget,
  BrandTile,
  Spacer,
  Hr,
  ProductWidget,
  Banner,
} from '@components';
import { menuIcon, whiteLogo, cart, search } from '@constants/icons';
import {
  topBanner,
  mediumBanner,
  boys,
  girls,
  category,
  brand,
  brand2,
  product1,
  product2,
  product3,
} from '@constants/images';
import styles from './styles';
import * as RootNavigation from '@navigators/RootNavigation';
import config from '../../constants/config';
import { callNonTokenApi } from '../../helpers/ApiRequest';
import { useDispatch, useSelector } from 'react-redux';
import { Description, SearchTextField } from '../../components';
import {
  setActiveTab,
  setAllAges,
  setAllBrands,
  setAllCategories,
  setAllCharacters,
  setAllPrices,
  setAllWrappers,
  setBallonCharges,
  setCart,
  setCartSessionID,
  setDeliveryCharges,
  setIsLoggedIn,
  setLoader,
  setTax,
  setUser,
  setGuestEmail,
  setGuestMobile,
} from '../../store/reducers/global';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getData } from '../../helpers/AsyncStorage';
import { LanguageContext } from '../../store/LanguageContext';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();

  const { language, toggleLanguage } = useContext(LanguageContext);

  const global = useSelector(state => state.global);
  const dispatch = useDispatch();

  const [topCategories, setTopCategories] = useState(null);
  const [categories, setCategories] = useState([]);

  const [searchText, setSearchText] = useState('');

  const [brands1, setBrands1] = useState([]);
  const [brands2, setBrands2] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [mostSelling, setMostSelling] = useState([]);
  const [forBoys, setForBoys] = useState([]);
  const [forGirls, setForGirls] = useState([]);

  // cart
  const [cartCount, setCartCount] = useState(0);

  // Track if error alert has been shown (to prevent multiple popups)
  const errorShownRef = useRef(false);

  // Load persisted guest info from AsyncStorage
  const loadGuestInfo = async () => {
    try {
      const guestEmail = await AsyncStorage.getItem('guest_email');
      const guestMobile = await AsyncStorage.getItem('guest_mobile');

      if (guestEmail) {
        dispatch(setGuestEmail(guestEmail));
      }
      if (guestMobile) {
        dispatch(setGuestMobile(guestMobile));
      }
    } catch (error) {
      console.log('Error loading guest info:', error);
    }
  };

  // Show error alert when API fails (only once per session)
  const showApiError = () => {
    // Prevent multiple error popups
    if (errorShownRef.current) {
      return;
    }
    errorShownRef.current = true;
    
    Alert.alert(
      t('error'),
      t('somethingWentWrong'),
      [{ 
        text: t('ok'), 
        style: 'default',
        onPress: () => {
          // Reset after user dismisses, so future errors can show
          errorShownRef.current = false;
        }
      }]
    );
  };

  function generateRandomString(length) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const saveIfNotExists = async (key, defaultValue) => {
    try {
      // Check if value exists for the key
      const existingValue = await AsyncStorage.getItem(key);

      // If value doesn't exist, save the default value
      if (existingValue === null) {
        await AsyncStorage.setItem(key, defaultValue);
        console.log(`Value for key ${key} saved as ${defaultValue}`);
        dispatch(setCartSessionID(defaultValue));
        getCart(defaultValue);
      } else {
        console.log(`Value for key ${key} already exists: ${existingValue}`);
        dispatch(setCartSessionID(existingValue));
        getCart(existingValue);
      }
    } catch (error) {
      console.error('Error saving value:', error);
    }
  };

  useEffect(() => {
    // Reset error flag on reload
    errorShownRef.current = false;
    
    dispatch(setLoader(true));
    const value = generateRandomString(20);
    saveIfNotExists('cart_session_random_value', value);

    // Load persisted guest info
    loadGuestInfo();

    fetchData();
    fetchHomeData();
    getProfile();
  }, [global.reload]);

  useEffect(() => {
    // Calculate total quantity instead of just counting items
    const totalQuantity = global.cart?.order_items?.reduce((total, item) => {
      return total + (item.quantity || 0);
    }, 0) ?? 0;
    setCartCount(totalQuantity);
    console.log('I am called home');
  }, [global.cart]);

  const getCart = async cart_session => {
    console.log(cart_session);
    dispatch(setLoader(true));
    callNonTokenApi(`${config.apiName.getCart}/${cart_session}`, 'GET')
      .then(res => {
        dispatch(setLoader(false));
        console.log(res.data.cart?.order_items?.length);
        // Calculate total quantity instead of just counting items
        const totalQuantity = res.data.cart?.order_items?.reduce((total, item) => {
          return total + (item.quantity || 0);
        }, 0) ?? 0;
        setCartCount(totalQuantity);
        dispatch(setCart(res.data.cart));
      })
      .catch(error => {
        dispatch(setLoader(false));
        console.log(error);
        showApiError();
      });
  };

  const fetchData = async () => {
    callNonTokenApi(`${config.apiName.utilsAPI}`, 'GET')
      .then(async res => {
        const is_device_login = await getData('is_device_login');
        if (is_device_login) {
          dispatch(setIsLoggedIn(true));
        }

        dispatch(setAllWrappers(res.data.wrappers));
        dispatch(setAllCharacters(res.data.characters));
        dispatch(setAllCategories(res.data.categories));
        dispatch(setAllBrands(res.data.brands));
        dispatch(setAllAges(res.data.ages));
        dispatch(setAllPrices(res.data.prices));
        dispatch(setBallonCharges(res.data.balloon_charges));
        dispatch(setDeliveryCharges(res.data.shipping_charges));
        dispatch(setTax(res.data.tax));
      })
      .catch(error => {
        console.log(error);
        showApiError();
      });
  };

  const fetchHomeData = async () => {
    callNonTokenApi(`${config.apiName.homeAPI}`, 'GET')
      .then(res => {
        console.log('home');
        setTopCategories(res.data.topCategories);
        const reducedArray = res.data.categories.slice(0, 6);
        setCategories(reducedArray);
        setNewArrivals(res.data.newArrivals);
        setMostSelling(res.data.mostSelling);
        setForBoys(res.data.forBoys);
        setForGirls(res.data.forGirls);
        setBrands1(res.data.brands);
        dispatch(setLoader(false));
      })
      .catch(error => {
        console.log(error);
        showApiError();
      });
  };

  const getProfile = async () => {
    console.log('profile', 'token ');
    dispatch(setLoader(true));
    const token = await getData('access_token');
    console.log(token, 'token ');
    if (token !== '') {
      callNonTokenApi(config.apiName.getProfile, 'GET')
        .then(res => {
          console.log(res.data);
          dispatch(setUser(res.data));
          dispatch(setLoader(false));
        })
        .catch(err => {
          dispatch(setLoader(false));
        });
    }
  };

  const handleBannerPress = (banner) => {
    if (banner.product_id) {
      RootNavigation.navigate('ProductDetail', { id: banner.product_id });
    } else if (banner.category_slug) {
      RootNavigation.navigate('ProductListing', { slug: banner.category_slug });
    }
  };

  const handleBrandPress = () => {
    console.log('Pressed!');
    dispatch(setActiveTab(2));
    RootNavigation.navigate('Brands');
    // Add your press event handling logic here
  };

  const handleCategoryPress = () => {
    console.log('Pressed!');
    dispatch(setActiveTab(1));
    RootNavigation.navigate('Categories');
    // Add your press event handling logic here
  };

  // Debug: Log forBoys data to check image URLs
  useEffect(() => {
    if (forBoys.length > 0) {
      console.log('🔍 forBoys data check:');
      forBoys.forEach((item, index) => {
        console.log(`  [${index}] ${item.name}: full_image = "${item.full_image || 'MISSING'}"`);
      });
    }
  }, [forBoys]);

  // Reset status bar when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('light-content');
  
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(COLORS.secondary);
      }
    }, [])
  );

  return (
      <MasterLayout
        bgColor={COLORS.bgGray}
        scrolling={true}
        max={true}
        statusBarColor={COLORS.secondary}
        statusBarStyle="light-content"
        header={
        <View style={styles.topBar}>
          <View style={styles.menuBar}>
            <View style={styles.menuIconImg}>
              <View style={styles.languageSwitch}>
                <Text style={{marginLeft:5,paddingRight:language==='EN' ? 0 : 3}}>{language}</Text>
                <Switch
                  onValueChange={lang => {
                    dispatch(setLoader(true));
                    toggleLanguage(lang);
                  }}
                  value={language === 'EN'}
                  style={{transform: [{scaleX: 0.7}, {scaleY: 0.7}]}}
                // thumbColor={'#f5dd4b'}
                />
              </View>
            </View>

            <Image source={whiteLogo} style={styles.menuLogo} />
            <TouchableOpacity
              style={styles.cartView}
              onPress={() => {
                if (cartCount > 0) {
                  RootNavigation.navigate('MyCart');
                } else {
                  Alert.alert(t('emptyCart'), t('pleaseAddItemsToYourCart'));
                }
              }}>
              <Image source={cart} style={styles.cartViewImage} />

              <Phrase txt={cartCount} txtStyle={styles.cartViewNumber} />
            </TouchableOpacity>
          </View>
          <SearchTextField />
        </View>
      }>
      {/* Dynamic Top Banner (Slider) */}
      <Banner
        type="Slider"
        onPress={handleBannerPress}
        style={styles.bannerContainer}
      />

      {/* Categories */}
      {topCategories == null ? null : (
        <View style={styles.contentView}>
          <View style={{...styles.headingView, marginBottom: 7, marginTop: language === 'AR' ? 10 : 0}}>
            <Heading txt={t('categories')} txtStyle={styles.heading} />
            <Pressable onPress={handleCategoryPress}>
              <Text style={styles.allLink}>{t('viewAll')}</Text>
            </Pressable>
          </View>
          <View style={{...styles.headingView,}}>
            <CategoryWidget
              name={t('shopFor') + topCategories[0].name}
              img={topCategories[0].full_image}
              slug={topCategories[0].slug}
              bgColor={COLORS.secondary}
            />
            <CategoryWidget
              name={t('shopFor') + topCategories[1].name}
              img={topCategories[1].full_image}
              slug={topCategories[0].slug}
              bgColor={COLORS.girls}
            />
          </View>
          <Hr />
          <FlatList
            scrollEnabled={false}
            data={categories}
            numColumns={2}
            renderItem={({ item }) => (
              <React.Fragment key={item.id}>
                <Spacer size={'lg'} />
                <CategoryTile item={item} />
              </React.Fragment>
            )}
            keyExtractor={item => item.id}
          />
        </View>
      )}

      {/* Categories */}

      {/* New Arrivals*/}
      <View style={styles.contentView}>
        <View style={{...styles.headingView,marginTop: language === 'AR' ? 10 : 0}}>
          <Heading txt={t('newArrivals')} txtStyle={styles.heading} />
        </View>
        {/* <Spacer /> */}
        <FlatList
          data={newArrivals}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <React.Fragment key={item.id}>
              <ProductWidget item={item} />
            </React.Fragment>
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={{ alignItems: 'center' }}
        />
      </View>
      {/* New Arrivals*/}

      {/* Most Selling*/}
      <View style={styles.contentView}>
        <View style={{...styles.headingView,marginTop: language === 'AR' ? 10 : 0}}>
          <Heading txt={t('mostSelling')} txtStyle={styles.heading} />
        </View>
        {/* <Spacer /> */}
        <FlatList
          data={mostSelling}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <React.Fragment key={item.id}>
              <ProductWidget item={item} />
            </React.Fragment>
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={{ alignItems: 'center' }}
        />
      </View>
      {/* Most Selling*/}

      {/* Dynamic Middle Banner */}
      <Banner
        type="Middle"
        onPress={handleBannerPress}
        style={styles.bannerContainer}
      />

      {/* For Boys */}
      <View style={styles.contentView}>
        <View style={{...styles.headingView,marginTop: language === 'AR' ? 10 : 0}}>
          <Heading txt={t('forBoys')} txtStyle={styles.heading} />
        </View>
        {/* <Spacer /> */}
        <FlatList
          data={forBoys}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <React.Fragment key={item.id}>
              <ProductWidget item={item} />
            </React.Fragment>
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={{ alignItems: 'center' }}
        />
      </View>
      {/* For Boys */}

      {/* For Girls */}
      <View style={styles.contentView}>
        <View style={{...styles.headingView,marginTop: language === 'AR' ? 10 : 0}}>
          <Heading txt={t('forGirls')} txtStyle={styles.heading} />
        </View>
        {/* <Spacer /> */}
        <FlatList
          data={forGirls}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <React.Fragment key={item.id}>
              <ProductWidget item={item} />
            </React.Fragment>
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={{ alignItems: 'center' }}
        />
      </View>
      {/* For Girls */}
      <Banner
        type="Bottom"
        onPress={handleBannerPress}
        style={styles.bannerContainer}
      />
      {/* For Brands */}
      <View style={styles.contentView}>
        <View style={{...styles.headingView,marginTop: language === 'AR' ? 10 : 0}}>
          <Heading txt={t('brands')} txtStyle={styles.heading} />
          <Pressable onPress={handleBrandPress}>
            <Text style={styles.allLink}>{t('viewAll')}</Text>
          </Pressable>
        </View>
        <FlatList
          data={brands1}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <React.Fragment key={item.id}>
              <Spacer size={'lg'} />
              <BrandTile item={item} />
            </React.Fragment>
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={{ alignItems: 'center' }}
        />
        <FlatList
          data={brands2}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <React.Fragment key={item.id}>
              <Spacer size={'lg'} />
              <BrandTile item={item} />
            </React.Fragment>
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={{ alignItems: 'center' }}
        />
      </View>
      {/* For Brands */}
      </MasterLayout>
  );
}
