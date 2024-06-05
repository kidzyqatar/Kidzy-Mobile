import {View, Text, Image, Pressable} from 'react-native';
import React, {useState} from 'react';
import {MasterLayout, RegisterForm} from '@components';

const Register = () => {
  return (
    <MasterLayout>
      <RegisterForm />
    </MasterLayout>
  );
};

export default Register;
