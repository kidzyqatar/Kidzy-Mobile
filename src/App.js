import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { PaperProvider } from 'react-native-paper';
import Providers from './store/providers';
import ApplicationNavigator from './navigators/Application';
import Route from './navigators/Route';
import SplashScreen from 'react-native-splash-screen';

const App = () => {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  }, []);

  return (
    <Providers>
      <PaperProvider>
        <Route />
      </PaperProvider>
    </Providers>
  );
};

export default App;
