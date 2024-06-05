import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  Image,
  ImageBackground,
  Pressable,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {COLORS, SIZES} from '@constants/theme';
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
} from '@components';
import {menuIcon, whiteLogo, cart, search} from '@constants/icons';
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
import {callNonTokenApi} from '../../helpers/ApiRequest';
import {useDispatch, useSelector} from 'react-redux';
import {Description, SearchTextField} from '../../components';
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
} from '../../store/reducers/global';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getData} from '../../helpers/AsyncStorage';

export default function Home() {
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
    dispatch(setLoader(true));
    const value = generateRandomString(20);
    saveIfNotExists('cart_session_random_value', value);

    fetchData();
    fetchHomeData();
    getProfile();
  }, [global.reload]);

  useEffect(() => {
    setCartCount(global.cart?.order_items?.length ?? 0);
    console.log('I am called home');
  }, [global.cart]);

  const getCart = async cart_session => {
    console.log(cart_session);
    dispatch(setLoader(true));
    callNonTokenApi(`${config.apiName.getCart}/${cart_session}`, 'GET')
      .then(res => {
        dispatch(setLoader(false));
        console.log(res.data.cart?.order_items?.length);
        setCartCount(res.data.cart?.order_items?.length ?? 0);
        dispatch(setCart(res.data.cart));
      })
      .catch(error => {
        dispatch(setLoader(false));
        console.log(error);
        setApiFailModal(true);
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
        setApiFailModal(true);
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
        setApiFailModal(true);
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

  return (
    <MasterLayout bgColor={COLORS.bgGray} scrolling={true} max={true}>
      {/* Menu Bar */}

      <View style={styles.topBar}>
        <View style={styles.menuBar}>
          <Image source={menuIcon} style={styles.menuIconImg} />
          <Image source={whiteLogo} style={styles.menuLogo} />
          <TouchableOpacity
            style={styles.cartView}
            onPress={() => {
              if (cartCount > 0) {
                RootNavigation.navigate('MyCart');
              } else {
                Alert.alert('Empty cart', 'Please add items to your cart');
              }
            }}>
            <Image source={cart} style={styles.cartViewImage} />
            <Phrase txt={cartCount} txtStyle={styles.cartViewNumber} />
          </TouchableOpacity>
        </View>
        <SearchTextField />
      </View>
      {/* Menu Bar */}

      {/* Top Banner */}
      <View style={styles.bannerContainer}>
        <ImageBackground
          source={topBanner}
          style={styles.bannerImg}></ImageBackground>
        <Text style={styles.bannerText}>
          {'The All New\nHot Wheels\nRampage\nNow Available'}
        </Text>
      </View>
      {/* Top Banner */}

      {/* Categories */}
      {topCategories == null ? null : (
        <View style={styles.contentView}>
          <View style={styles.headingView}>
            <Heading txt={'Categories'} txtStyle={styles.heading} />
            <Pressable onPress={handleCategoryPress}>
              <Text style={styles.allLink}>View All</Text>
            </Pressable>
          </View>
          <View style={styles.headingView}>
            <CategoryWidget
              name={`Shop for ${topCategories[0].name}`}
              img={topCategories[0].full_image}
              slug={topCategories[0].slug}
              bgColor={COLORS.secondary}
            />
            <CategoryWidget
              name={`Shop for ${topCategories[1].name}`}
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
            renderItem={({item}) => (
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
        <View style={styles.headingView}>
          <Heading txt={'New Arrivals'} txtStyle={styles.heading} />
          {/* <Pressable>
              <Text style={styles.allLink}>View All</Text>
            </Pressable> */}
        </View>
        <Spacer />
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
      {/* New Arrivals*/}

      {/* Most Selling*/}
      <View style={styles.contentView}>
        <View style={styles.headingView}>
          <Heading txt={'Most Selling'} txtStyle={styles.heading} />
          {/* <Pressable>
              <Text style={styles.allLink}>View All</Text>
            </Pressable> */}
        </View>
        <Spacer />
        <FlatList
          data={mostSelling}
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
      {/* Most Selling*/}

      {/* Medium Banner */}
      <View style={styles.bannerContainer}>
        <ImageBackground
          source={mediumBanner}
          style={styles.bannerImg}></ImageBackground>
        <Text style={styles.bannerText}>
          {'All new legos\nnow available\nat Kidzy'}
        </Text>
      </View>
      {/* Medium Banner */}

      {/* For Boys */}
      <View style={styles.contentView}>
        <View style={styles.headingView}>
          <Heading txt={'For Boys'} txtStyle={styles.heading} />
          {/* <Pressable>
              <Text style={styles.allLink}>View All</Text>
            </Pressable> */}
        </View>
        <Spacer />
        <FlatList
          data={forBoys}
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
      {/* For Boys */}

      {/* For Girls */}
      <View style={styles.contentView}>
        <View style={styles.headingView}>
          <Heading txt={'For Girls'} txtStyle={styles.heading} />
          {/* <Pressable>
              <Text style={styles.allLink}>View All</Text>
            </Pressable> */}
        </View>
        <Spacer />
        <FlatList
          data={forGirls}
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
      {/* For Girls */}

      {/* For Brands */}
      <View style={styles.contentView}>
        <View style={styles.headingView}>
          <Heading txt={'Brands'} txtStyle={styles.heading} />
          <Pressable onPress={handleBrandPress}>
            <Text style={styles.allLink}>View All</Text>
          </Pressable>
        </View>
        <FlatList
          data={brands1}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <React.Fragment key={item.id}>
              <Spacer size={'lg'} />
              <BrandTile item={item} />
            </React.Fragment>
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={{alignItems: 'center'}}
        />
        <FlatList
          data={brands2}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <React.Fragment key={item.id}>
              <Spacer size={'lg'} />
              <BrandTile item={item} />
            </React.Fragment>
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={{alignItems: 'center'}}
        />
      </View>
      {/* For Brands */}
    </MasterLayout>
  );
}
