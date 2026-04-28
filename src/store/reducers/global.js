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
  payment_method: 'cod',
  cart_billing_address: null,
  cart_friend_address: null, // Store friend address locally in Redux
  cart_ballons_count: 0,
  cart_character: null,
  cart_delivery_date: '',
  cart_delivery_time: '',
  
  // Add guest information
  guest_email: '',
  guest_mobile: '',

  /** `order_item_id` → true when user removed custom wrapper image locally (no delete API). */
  orderItemCustomImageSuppressed: {},
  /**
   * `order_item_id` → `'off'` (toggle off: hide wrapper UI + no charge) or `'cleared'` (trash / reopen toggle:
   * show grid, ignore server wrapper for charge until user attaches again).
   */
  orderItemGiftWrapperMode: {},
};
const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setUser: (state, action) => {
      return {...state, user: action.payload};
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
      const nextCart = action.payload || {};
      const items = nextCart.order_items || [];
      const validIds = new Set(items.map(oi => String(oi.id)));
      const pruneIds = obj => {
        const next = {...(obj ?? {})};
        Object.keys(next).forEach(k => {
          if (!validIds.has(k)) {
            delete next[k];
          }
        });
        return next;
      };
      return {
        ...state,
        cart: action.payload,
        orderItemCustomImageSuppressed: pruneIds(
          state.orderItemCustomImageSuppressed,
        ),
        orderItemGiftWrapperMode: pruneIds(state.orderItemGiftWrapperMode),
      };
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

    setFriendAddress: (state, action) => {
      return {...state, cart_friend_address: action.payload};
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
    setSendtoFriend: (state, action) => {
      return {...state, cart_is_sent_to_friend: action.payload};
    },

    setPaymentMethod: (state, action) => {
      return {...state, payment_method: action.payload};
    },

    setCartCalculations: (state, action) => {
      return {...state, cart_calculation: action.payload};
    },
    setGuestEmail: (state, action) => {
      return {...state, guest_email: action.payload};
    },
    setGuestMobile: (state, action) => {
      return {...state, guest_mobile: action.payload};
    },
    clearGuestInfo: (state) => {
      return {...state, guest_email: '', guest_mobile: ''};
    },

    suppressOrderItemCustomImage: (state, action) => {
      const id = String(action.payload);
      return {
        ...state,
        orderItemCustomImageSuppressed: {
          ...state.orderItemCustomImageSuppressed,
          [id]: true,
        },
      };
    },

    clearOrderItemCustomImageSuppressed: (state, action) => {
      const id = String(action.payload);
      const next = {...state.orderItemCustomImageSuppressed};
      delete next[id];
      return {...state, orderItemCustomImageSuppressed: next};
    },

    clearAllOrderItemCustomImageSuppressed: state => ({
      ...state,
      orderItemCustomImageSuppressed: {},
    }),

    setOrderItemGiftWrapperMode: (state, action) => {
      const id = String(action.payload.orderItemId);
      const mode = action.payload.mode;
      const next = {...(state.orderItemGiftWrapperMode ?? {})};
      if (mode === undefined || mode === null) {
        delete next[id];
      } else {
        next[id] = mode;
      }
      return {...state, orderItemGiftWrapperMode: next};
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
  setSendtoFriend,
  setBallonCharges,
  setDeliveryCharges,
  setTax,
  setPaymentMethod,
  setSelectedShippingAddress,
  setSelectedBillingAddress,
  setFriendAddress,
  setBallonsCount,
  setSelectedCharacter,
  setSelectedDeliveryTime,
  setSelectedDeliveryDate,
  setSameAsBillingAddress,
  setCartCalculations,
  setGuestEmail,
  setGuestMobile,
  clearGuestInfo,
  suppressOrderItemCustomImage,
  clearOrderItemCustomImageSuppressed,
  clearAllOrderItemCustomImageSuppressed,
  setOrderItemGiftWrapperMode,
} = globalSlice.actions;
export default globalSlice.reducer;
