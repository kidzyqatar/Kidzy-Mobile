import axios from 'axios';
import client from '../constants/config';
import {getData} from './AsyncStorage';
// import { getData } from './AsyncStorageConfig';

var instance = axios.create({
  baseURL: client.api.baseURL,
  timeout: 200000,
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

const isFailedResponse = response => {
  if (response.status != 200 && response.status != 201) {
    return true;
  }
  return false;
};

const getAccessToken = async () => {
  const token = await getData('access_token');
  return token;
};

export const callNonTokenApi = async (url, method, params) => {
  const token = await getAccessToken();
  if (token === '') {
    console.log('without token', url, method);
    var response = await instance({
      url: url,
      method: method,
      data: params,
    });
    const value = isFailedResponse(response);
    return !value ? response.data : null;
  } else {
    console.log('with token', url, method);
    var response = await instance({
      url: url,
      method: method,
      data: params,
      headers: {
        authorization: 'Bearer ' + token,
      },
    });
    // console.log(response.data)
    const value = isFailedResponse(response);
    return !value ? response.data : null;
  }
};

export const callNonTokenApiAddress = async (url, method, params) => {
  const token = await getAccessToken();
  var response = await instance({
    url: url,
    method: method,
    data: params,
  });
  const value = isFailedResponse(response);
  return !value ? response.data : null;
};

export const callNonTokenApiMP = async (url, method, params) => {
  const token = await getAccessToken();
  if (token === '') {
    var response = await instance({
      url: url,
      method: method,
      data: params,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(url, response.data.data);
    const value = isFailedResponse(response);
    return !value ? response.data : null;
  } else {
    var response = await instance({
      url: url,
      method: method,
      data: params,
      headers: {
        authorization: 'Bearer ' + token,
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(url, response.data.data);
    const value = isFailedResponse(response);
    return !value ? response.data : null;
  }
};
