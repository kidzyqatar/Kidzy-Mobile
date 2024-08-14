import React, {useEffect, useState} from 'react';
import {FlatList, Image, Text, View} from 'react-native';
import {COLORS, SIZES} from '@constants/theme';
import {MasterLayout, CartBar, BrandTile, Spacer, Input} from '@components';
import {brand} from '@constants/images';
import {search} from '@constants/icons';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';

export default function Brands() {
  const {t} = useTranslation();
  const global = useSelector(state => state.global);
  const [brands, setBrands] = useState(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    setBrands(global.allBrands);
  }, []);

  useEffect(() => {
    if (searchText) {
      const newData = brands.filter(obj =>
        obj.name.toLowerCase().match(searchText.toLowerCase()),
      );
      setBrands(newData);
    } else {
      setBrands(global.allBrands);
    }
  }, [searchText]);

  return (
    <MasterLayout bgColor={COLORS.bgGray}>
      <CartBar title={t('brands')} />
      <Spacer />
      <Input
        placeholder={t('search')}
        right={search}
        isSecure={false}
        value={searchText}
        setValue={setSearchText}
      />
      <FlatList
        data={brands}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <React.Fragment key={item.id}>
            <Spacer size={'lg'} />
            <BrandTile item={item} />
          </React.Fragment>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={{alignItems: 'center'}}
      />
    </MasterLayout>
  );
}
