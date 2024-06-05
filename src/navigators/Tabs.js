import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Home,
  Categories,
  Brands,
  Account,
  ProductListing,
  ProductDetail,
  Orders,
  OrderDetail,
  Wallet,
  PaymentInformation,
  Address,
  Profile,
} from '@screens';
import { SIZES, COLORS, FONTS } from '@constants/theme';
import {
  menuHome,
  menuCategories,
  menuBrands,
  menuAccount,
} from '@constants/icons';

import * as RootNavigation from './RootNavigation';
import { Phrase } from '../components';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from '../store/reducers/global';
const Tab = createBottomTabNavigator();

const Tabs = () => {
  const dispatch = useDispatch();
  const global = useSelector(state => state.global);
  const TabBar = () => {
    return (
      <View style={styles.tabContainer}>
        <Pressable
          style={styles.tab}
          onPress={() => {
            dispatch(setActiveTab(0));
            RootNavigation.navigate('Home');
          }}>
          <Image
            source={menuHome}
            style={[
              styles.tabIcon,
              {
                tintColor:
                  global?.activeTab == 0 ? COLORS.secondary : COLORS.iconGray,
              },
            ]}
          />
          <Phrase
            txtStyle={{
              ...FONTS.body6_medium,
              marginTop: SIZES.base,
              color:
                global?.activeTab == 0 ? COLORS.secondary : COLORS.iconGray,
            }}
            txt={'Home'}
          />
        </Pressable>
        <Pressable
          style={styles.tab}
          onPress={() => {
            dispatch(setActiveTab(1));
            RootNavigation.navigate('Categories');
          }}>
          <Image
            source={menuCategories}
            style={[
              styles.tabIcon,
              {
                tintColor:
                  global?.activeTab == 1 ? COLORS.secondary : COLORS.iconGray,
              },
            ]}
          />
          <Phrase
            txtStyle={{
              ...FONTS.body6_medium,
              marginTop: SIZES.base,
              color:
                global?.activeTab == 1 ? COLORS.secondary : COLORS.iconGray,
            }}
            txt={'Categories'}
          />
        </Pressable>
        <Pressable
          style={styles.tab}
          onPress={() => {
            dispatch(setActiveTab(2));
            RootNavigation.navigate('Brands');
          }}>
          <Image
            source={menuBrands}
            style={[
              styles.tabIcon,
              {
                tintColor:
                  global?.activeTab == 2 ? COLORS.secondary : COLORS.iconGray,
              },
            ]}
          />
          <Phrase
            txtStyle={{
              ...FONTS.body6_medium,
              marginTop: SIZES.base,
              color:
                global?.activeTab == 2 ? COLORS.secondary : COLORS.iconGray,
            }}
            txt={'Brands'}
          />
        </Pressable>
        <Pressable
          style={styles.tab}
          onPress={() => {
            dispatch(setActiveTab(3));
            RootNavigation.navigate('Account');
          }}>
          <Image
            source={menuAccount}
            style={[
              styles.tabIcon,
              {
                tintColor:
                  global?.activeTab == 3 ? COLORS.secondary : COLORS.iconGray,
              },
            ]}
          />
          <Phrase
            txtStyle={{
              ...FONTS.body6_medium,
              marginTop: SIZES.base,
              color:
                global?.activeTab == 3 ? COLORS.secondary : COLORS.iconGray,
            }}
            txt={'Account'}
          />
        </Pressable>
      </View>
    );
  };
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarHideOnKeyboard: true,
          keyboardHidesTabBar: true,
          gestureEnabled: true,
        }}
        tabBar={() => {
          return <TabBar />;
        }}>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Categories" component={Categories} />
        <Tab.Screen name="Brands" component={Brands} />
        <Tab.Screen name="Account" component={Account} options={{ unmountOnBlur: true }} />
        <Tab.Screen name="ProductListing" component={ProductListing} options={{ unmountOnBlur: true }} />
        <Tab.Screen name="ProductDetail" component={ProductDetail} options={{ unmountOnBlur: true }} />
        <Tab.Screen name="Orders" component={Orders} options={{ unmountOnBlur: true }} />
        <Tab.Screen name="OrderDetail" component={OrderDetail} />
        <Tab.Screen name="Wallet" component={Wallet} />
        <Tab.Screen name="PaymentInformation" component={PaymentInformation} />
        <Tab.Screen name="Address" component={Address} options={{ unmountOnBlur: true }} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    justifyContent: 'space-between',
    width: SIZES.hundred,
    flexDirection: 'row',
    paddingTop: SIZES.minor,
    height: SIZES.ten,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.gray2,
    shadowOffset: { width: 1, height: -2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  tab: {
    width: SIZES.twentyFive,
    // backgroundColor: 'brown',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIcon: { width: 20, height: 20, resizeMode: 'contain' },
  //   tabTxt: {}
});

export default Tabs;
