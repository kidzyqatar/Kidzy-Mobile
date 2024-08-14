import 'react-native-gesture-handler';
import React, {useEffect, useContext} from 'react';
import {PaperProvider} from 'react-native-paper';
import Providers from './store/providers';
import Route from './navigators/Route';
import SplashScreen from 'react-native-splash-screen';
import WhatsAppBubble from './components/WhatsAppBubble';
import {I18nManager} from 'react-native';
import {LanguageProvider, LanguageContext} from './store/LanguageContext';
import './translations/index.js';
import {useTranslation} from 'react-i18next';

const App = () => {
  const {language} = useContext(LanguageContext);
  const {i18n} = useTranslation();

  useEffect(() => {
    I18nManager.forceRTL(language === 'AR');
    i18n.changeLanguage(language.toLowerCase());
  }, [language]);

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  }, []);

  return (
    <Providers>
      <PaperProvider>
        <Route />
        <WhatsAppBubble />
      </PaperProvider>
    </Providers>
  );
};

export default function AppWrapper() {
  return (
    <LanguageProvider>
      <App />
    </LanguageProvider>
  );
}
