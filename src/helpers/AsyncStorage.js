import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = (storageKey, value, callback) => {
    try {
        // console.log(storageKey+ '  ' + value)
        AsyncStorage.setItem(storageKey, value, () => {
            callback();
        });
    } catch (e) {
        console.log('Sotre error: ' + e);
    }
};

export const storeJSONData = async (storageKey, value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(storageKey, jsonValue);
    } catch (e) {
        console.log(e);
        console.log('Sotre error: ' + e);
    }
};

export const getData = async storageKey => {
    try {
        const value = await AsyncStorage.getItem(storageKey);
        if (value !== null) {
            return value;
        }
    } catch (e) {
        console.log('Get data error: ' + e);
    }
    return '';
};

export const getJSONData = async storageKey => {
    try {
        const jsonValue = await AsyncStorage.getItem(storageKey);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.log('Get data error: ' + e);
    }
    return null;
};