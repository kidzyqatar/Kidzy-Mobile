import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Register, Login, MyCart, Thankyou} from '@screens';
import Tabs from './Tabs';

const ApplicationNavigator = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={'HomeScreen'}>
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="MyCart" component={MyCart} />
      <Stack.Screen name="Thankyou" component={Thankyou} />
      <Stack.Screen name="HomeScreen" component={Tabs} />
    </Stack.Navigator>
  );
};

export default ApplicationNavigator;
