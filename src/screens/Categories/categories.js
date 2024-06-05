import React, { useEffect, useState } from 'react';
import { FlatList, Image, Text, View } from 'react-native';
import { COLORS } from '@constants/theme';
import { MasterLayout, CartBar, CategoryTile, Spacer } from '@components';
import { category } from '@constants/images';
import { useSelector } from 'react-redux';

export default function Categories() {
  const global = useSelector(state => state.global);
  const [categories, setCategories] = useState(null)
  useEffect(() => {

    setCategories(global.allCategories)
  }, []);
  return (
    <MasterLayout bgColor={COLORS.bgGray}>
      <CartBar title={'Categories'} />
      <Spacer />

      <FlatList
        data={categories}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <React.Fragment key={item.id}>
            <Spacer size={'lg'} />
            <CategoryTile item={item} />
          </React.Fragment>
        )}
        keyExtractor={item => item.id}
      // contentContainerStyle={{paddingHorizontal: 8}}
      />
    </MasterLayout>
  );
}
