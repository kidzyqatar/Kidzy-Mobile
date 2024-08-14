import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeModules} from 'react-native';

// Create a Context for the language
export const LanguageContext = createContext();

export const LanguageProvider = ({children}) => {
  const [language, setLanguage] = useState('EN'); // Default to 'EN'

  useEffect(() => {
    // Function to load language from AsyncStorage
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('language');
        if (savedLanguage) {
          setLanguage(savedLanguage);
        }
      } catch (error) {
        console.error('Failed to load language from storage:', error);
      }
    };

    // Load the language on component mount
    loadLanguage();
  }, []);

  const toggleLanguage = async () => {
    const newLanguage = language === 'EN' ? 'AR' : 'EN';
    setLanguage(newLanguage);
    try {
      await AsyncStorage.setItem('language', newLanguage);
    } catch (error) {
      console.error('Failed to save language to storage:', error);
    }
    NativeModules.DevSettings.reload(); // Reload the app to apply language change
  };

  return (
    <LanguageContext.Provider value={{language, toggleLanguage}}>
      {children}
    </LanguageContext.Provider>
  );
};
