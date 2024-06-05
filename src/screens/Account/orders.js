import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
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
import { COLORS, SIZES, FONTS } from '@constants/theme';
import globalStyles from '@constants/global-styles';
import { styles } from './styles';
import { product1, product2, product3 } from '@constants/images';
import { callNonTokenApi } from '../../helpers/ApiRequest';
import config from '../../constants/config';
import { useDispatch } from 'react-redux';
import { setLoader } from '../../store/reducers/global';

const Orders = () => {
  const dispatch = useDispatch();
  const [value, setValue] = React.useState(0);
  const [ordersPending, setOrderPending] = useState([]);
  const [ordersProcessing, setOrderProcessing] = useState([]);
  const [ordersComplete, setOrderComplete] = useState([]);
  const [noOrder, setNoOrder] = useState(false);

  useEffect(() => {
    getOrders()
  }, [])
  useEffect(() => {

  }, [ordersPending, ordersProcessing, ordersComplete])

  const getOrders = async () => {
    dispatch(setLoader(true))
    callNonTokenApi(config.apiName.getOrders, 'GET')
      .then(res => {
        dispatch(setLoader(false));
        if (res.status == 200) {
          const filteredPending = res.data.orders.filter(task => task.status === "CART");
          const filteredProcessing = res.data.orders.filter(task => task.status === "PROCESSING");
          const filteredCompleted = res.data.orders.filter(task => task.status === "COMPLETED");
          setOrderPending(filteredPending)
          setOrderProcessing(filteredProcessing)
          setOrderComplete(filteredCompleted)
          if (res.data.orders.length() > 0) {
            console.log(res.data.orders.length())
            setNoOrder(false)
          } else {
            setNoOrder(true)
          }
        } else {
          Alert.alert('Error!', res.message)
        }
      })
      .catch(err => {
        dispatch(setLoader(false))
      })
  }

  return (
    <MasterLayout bgColor={COLORS.bgGray} scrolling={false} max={true}>
      <View style={globalStyles.whiteBg}>
        <BackBar title={'My Orders'} navigateTo={'Account'} />
      </View>
      <Spacer />
      {
        noOrder ? (<Phrase
          txt={'No Order Found'}
          txtStyle={{ color: value == 2 ? COLORS.white : COLORS.black }}
        />) : (
          <View style={globalStyles.whiteBg}>
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
                    txt={'Pending'}
                    txtStyle={{ color: value == 0 ? COLORS.white : COLORS.black }}
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
                    txt={'Processing'}
                    txtStyle={{ color: value == 1 ? COLORS.white : COLORS.black }}
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
                    txt={'Complete'}
                    txtStyle={{ color: value == 2 ? COLORS.white : COLORS.black }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <Spacer />
            {value == 0 && (
              <ScrollView style={{ marginBottom: 100 }} scrollEnabled={true} showsVerticalScrollIndicator={false}>
                {ordersPending.map((item, index) => {
                  return (
                    <React.Fragment key={index.toString()}>
                      <Spacer />
                      <OrderItem item={item} />
                    </React.Fragment>
                  );
                })}
              </ScrollView>
            )}

            {value == 1 && (
              <ScrollView style={{ marginBottom: 100 }} scrollEnabled={true} showsVerticalScrollIndicator={false}>
                {ordersProcessing.map((item, index) => {
                  return (
                    <React.Fragment key={index.toString()}>
                      <Spacer />
                      <OrderItem item={item} />
                    </React.Fragment>
                  );
                })}
              </ScrollView>
            )}
            {value == 2 && (
              <ScrollView style={{ marginBottom: 100 }} scrollEnabled={true} showsVerticalScrollIndicator={false}>
                {ordersComplete.map((item, index) => {
                  return (
                    <React.Fragment key={index.toString()}>
                      <Spacer />
                      <OrderItem item={item} />
                    </React.Fragment>
                  );
                })}
              </ScrollView>
            )}
          </View>
        )
      }

    </MasterLayout >
  );
};

export default Orders;
