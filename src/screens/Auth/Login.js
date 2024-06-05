import {View, Text, Image, Pressable} from 'react-native';
import React, {useState} from 'react';
import {Button} from 'react-native-paper';
import {
  logo,
  mail,
  user,
  lock,
  eye,
  userSimple,
  googleIcon,
} from '@constants/icons';
import styles from './styles';
import {MasterLayout, LoginForm} from '@components';
import {COLORS, FONTS, SIZES} from '@constants/theme';
import * as RootNavigation from '@navigators/RootNavigation';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const Login = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  return (
    <MasterLayout>
      <LoginForm />
    </MasterLayout>
  );
};

export default Login;
