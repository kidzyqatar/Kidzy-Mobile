// store/reducers/counter.js
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  user: null,
  loader: false,
  isLoggedIn: false,
  reload: false,
  cart: {},
  allCategories: [],
  allBrands: [],
  allWrappers: [],
  allCharacters: [],
  allAges: [],
  allPrices: [],
  checkoutStep: 1,
  activeTab: 0,
  cart_session_id: '', //'akjhcioashdckjqs89yoasnd',
  tax: 2,
  shipping_charges: 10,
  balloon_charges: 10,
  cart_calculation: {},

  //Selected for Cart
  cart_shipping_address: null,
  cart_is_same_as_billing: false,
  cart_is_sent_to_friend: false,
  cart_billing_address: null,
  cart_ballons_count: 0,
  cart_character: null,
  cart_delivery_date: '',
  cart_delivery_time: '',
};
const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setUser: (state, action) => {
      return {...state, user: action.payload};
      console.log(state, action);
    },
    setLoader: (state, action) => {
      return {...state, loader: action.payload};
    },
    setIsLoggedIn: (state, action) => {
      return {...state, isLoggedIn: action.payload};
    },
    setReload: (state, action) => {
      return {...state, reload: action.payload};
    },
    setCart: (state, action) => {
      return {...state, cart: action.payload};
    },
    setAllCategories: (state, action) => {
      return {...state, allCategories: action.payload};
    },
    setAllCharacters: (state, action) => {
      return {...state, allCharacters: action.payload};
    },
    setAllBrands: (state, action) => {
      return {...state, allBrands: action.payload};
    },
    setAllWrappers: (state, action) => {
      return {...state, allWrappers: action.payload};
    },
    setAllAges: (state, action) => {
      return {...state, allAges: action.payload};
    },
    setAllPrices: (state, action) => {
      return {...state, allPrices: action.payload};
    },
    setCheckoutStep: (state, action) => {
      return {...state, checkoutStep: action.payload};
    },
    setActiveTab: (state, action) => {
      return {...state, activeTab: action.payload};
    },
    setCartSessionID: (state, action) => {
      return {...state, cart_session_id: action.payload};
    },
    setTax: (state, action) => {
      return {...state, tax: action.payload};
    },
    setDeliveryCharges: (state, action) => {
      return {...state, shipping_charges: action.payload};
    },
    setBallonCharges: (state, action) => {
      return {...state, balloon_charges: action.payload};
    },

    setSelectedShippingAddress: (state, action) => {
      return {...state, cart_shipping_address: action.payload};
    },
    setSelectedBillingAddress: (state, action) => {
      return {...state, cart_billing_address: action.payload};
    },

    setBallonsCount: (state, action) => {
      return {...state, cart_ballons_count: action.payload};
    },

    setSelectedCharacter: (state, action) => {
      return {...state, cart_character: action.payload};
    },

    setSelectedDeliveryDate: (state, action) => {
      return {...state, cart_delivery_date: action.payload};
    },

    setSelectedDeliveryTime: (state, action) => {
      return {...state, cart_delivery_time: action.payload};
    },

    setSameAsBillingAddress: (state, action) => {
      return {...state, cart_is_same_as_billing: action.payload};
    },

    setSentToFriend: (state, action) => {
      return {...state, cart_is_sent_to_friend: action.payload};
    },

    setCartCalculations: (state, action) => {
      return {...state, cart_calculation: action.payload};
    },
  },
});

export const {
  setUser,
  setLoader,
  setIsLoggedIn,
  setReload,
  setCart,
  setAllCategories,
  setAllBrands,
  setAllWrappers,
  setAllAges,
  setAllPrices,
  setCheckoutStep,
  setActiveTab,
  setCartSessionID,
  setAllCharacters,
  setBallonCharges,
  setDeliveryCharges,
  setTax,
  setSelectedShippingAddress,
  setSelectedBillingAddress,
  setBallonsCount,
  setSelectedCharacter,
  setSelectedDeliveryTime,
  setSelectedDeliveryDate,
  setSameAsBillingAddress,
  setSentToFriend,
  setCartCalculations,
} = globalSlice.actions;
export default globalSlice.reducer;
