import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import ApplicationNavigator from './Application';
import AuthNavigator from './Auth';
import {navigationRef} from './RootNavigation';
import {useSelector} from 'react-redux';
import ActivityIndicatorOverlay from '../components/ActivityIndicator/ActivityIndicatorOverlay';
export default function Route() {
  const global = useSelector(state => state.global);

  useEffect(() => {
    console.log('App reload');
  }, [global.reload]);

  return (
    <>
      <NavigationContainer ref={navigationRef}>
        {/* {global?.isLoggedIn ? <ApplicationNavigator /> : <AuthNavigator />} */}
        <ApplicationNavigator />
      </NavigationContainer>
      <ActivityIndicatorOverlay visible={global.loader} />
    </>
  );
}
