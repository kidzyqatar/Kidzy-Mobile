import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView, Alert} from 'react-native';
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
import {styles} from './styles';
import {product1, product2, product3} from '@constants/images';
import {callNonTokenApi} from '../../helpers/ApiRequest';
import config from '../../constants/config';
import {useDispatch} from 'react-redux';
import {setLoader} from '../../store/reducers/global';
import {useTranslation} from 'react-i18next';

const Orders = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [value, setValue] = React.useState(0);
  const [ordersPending, setOrderPending] = useState([]);
  const [ordersProcessing, setOrderProcessing] = useState([]);
  const [ordersComplete, setOrderComplete] = useState([]);
  const [noOrder, setNoOrder] = useState(false);

  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    console.log('📋 Orders State:', {
      pending: ordersPending.length,
      processing: ordersProcessing.length,
      complete: ordersComplete.length,
      currentTab: value
    });
  }, [ordersPending, ordersProcessing, ordersComplete, value]);

  // Pending tab: orders awaiting payment / confirmation (API may use PENDING, CART, etc.)
  const getOrders = async () => {
    dispatch(setLoader(true));
    callNonTokenApi(config.apiName.getOrders, 'GET')
      .then(res => {
        dispatch(setLoader(false));

        // console.log('[My Orders] getOrders — full raw API response:', JSON.stringify(res, null, 2));

        if (res && res.status == 200 && Array.isArray(res.data?.orders)) {
          const allOrders = res.data.orders;
          const statuses = [...new Set(allOrders.map(o => o?.status).filter(Boolean))];
          // console.log('[My Orders] order count:', JSON.stringify(allOrders, null, 2));
          // console.log('[My Orders] distinct status values from API:', statuses);

          const filteredPending = allOrders.filter(task =>
            task.status === 'PENDING' ||
            // task.status === 'CART' ||
            task.status === 'PENDING_PAYMENT',
          );
          const filteredProcessing = allOrders.filter(
            task => task.status === 'PROCESSING',
          );
          const filteredCompleted = allOrders.filter(
            task => task.status === 'COMPLETED',
          );

          // console.log(
          //   '[My Orders] filtered pending (PENDING | CART | PENDING_PAYMENT):',
          //   JSON.stringify(filteredPending, null, 2),
          // );
          // console.log('[My Orders] filtered processing:', filteredProcessing.length);
          // console.log('[My Orders] filtered completed:', filteredCompleted.length);

          setOrderPending(filteredPending);
          setOrderProcessing(filteredProcessing);
          setOrderComplete(filteredCompleted);
          if (allOrders.length > 0) {
            setNoOrder(false);
          } else {
            setNoOrder(true);
          }
        } else {
          console.warn('[My Orders] unexpected response shape or status:', res);
          Alert.alert(t('error'), res?.message ?? 'Could not load orders.');
        }
      })
      .catch(err => {
        dispatch(setLoader(false));
        console.log('[My Orders] getOrders error:', err);
      });
  };

  return (
    <MasterLayout 
    bgColor={COLORS.bgGray} 
    scrolling={false} 
    max={true}
    statusBarColor={COLORS.white}
    statusBarStyle="dark-content"
    
    >
      <View style={globalStyles.whiteBg}>
        <BackBar title={t('myOrders')} navigateTo={'Account'} />
      </View>
      <Spacer />
      <View style={[globalStyles.whiteBg, {flex: 1}]}>
        <View style={globalStyles.contentContainer}>
          <View style={styles.pillsContainer}>
            <TouchableOpacity
              style={[
                styles.pillBtn,
                {
                  backgroundColor:
                    value == 0 ? COLORS.secondary : 'transparent',
                },
              ]}
              onPress={() => {
                setValue(0);
              }}>
              <Phrase
                txt={t('pending')}
                txtStyle={{color: value == 0 ? COLORS.white : COLORS.black}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.pillBtn,
                {
                  backgroundColor:
                    value == 1 ? COLORS.secondary : 'transparent',
                },
              ]}
              onPress={() => {
                setValue(1);
              }}>
              <Phrase
                txt={t('processing')}
                txtStyle={{color: value == 1 ? COLORS.white : COLORS.black}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.pillBtn,
                {
                  backgroundColor:
                    value == 2 ? COLORS.secondary : 'transparent',
                },
              ]}
              onPress={() => {
                setValue(2);
              }}>
              <Phrase
                txt={t('complete')}
                txtStyle={{color: value == 2 ? COLORS.white : COLORS.black}}
              />
            </TouchableOpacity>
          </View>
        </View>
        <Spacer />
        
        {/* Pending Orders */}
        {value == 0 && (
          ordersPending.length > 0 ? (
            <ScrollView
              style={{ paddingHorizontal: SIZES.base}}
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}>
              {ordersPending.map((item, index) => {
                return (
                  <React.Fragment key={index.toString()}>
                    <Spacer />
                    <OrderItem item={item} />
                  </React.Fragment>
                );
              })}
            </ScrollView>
          ) : (
            <View style={styles.emptyContainer}>
              <Phrase txt={t('noPendingOrders')} txtStyle={styles.emptyText} />
            </View>
          )
        )}

        {/* Processing Orders */}
        {value == 1 && (
          ordersProcessing.length > 0 ? (
            <ScrollView
              style={{marginBottom: 100, paddingHorizontal: SIZES.padding}}
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}>
              {ordersProcessing.map((item, index) => {
                return (
                  <React.Fragment key={index.toString()}>
                    <Spacer />
                    <OrderItem item={item} />
                  </React.Fragment>
                );
              })}
            </ScrollView>
          ) : (
            <View style={styles.emptyContainer}>
              <Phrase txt={t('noProcessingOrders')} txtStyle={styles.emptyText} />
            </View>
          )
        )}

        {/* Completed Orders */}
        {value == 2 && (
          ordersComplete.length > 0 ? (
            <ScrollView
              style={{marginBottom: 100, paddingHorizontal: SIZES.padding}}
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}>
              {ordersComplete.map((item, index) => {
                return (
                  <React.Fragment key={index.toString()}>
                    <Spacer />
                    <OrderItem item={item} />
                  </React.Fragment>
                );
              })}
            </ScrollView>
          ) : (
            <View style={styles.emptyContainer}>
              <Phrase txt={t('noCompletedOrders')} txtStyle={styles.emptyText} />
            </View>
          )
        )}
      </View>
    </MasterLayout>
  );
};

export default Orders;
