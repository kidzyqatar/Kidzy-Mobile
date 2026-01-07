import {View, Text, Image, StyleSheet, Pressable} from 'react-native';
import React from 'react';
import {SIZES, FONTS, COLORS} from '@constants/theme';
import {Phrase} from '@components';
import {category} from '@constants/images';
import {forwardArrow} from '@constants/icons';
import * as RootNavigation from '@navigators/RootNavigation';

const CategoryTile = ({item}) => {
  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        RootNavigation.navigate('ProductListing', {
          namE: item.name,
          slug: item.slug,
          type: 'category',
        });
      }}>
      <View style={styles.innerContainer}>
        <View style={styles.leftView}>
          <Phrase txt={item.name} txtStyle={styles.txt}
          //  numberOfLine={2}
            />
          <Image source={forwardArrow} style={styles.img} />
        </View>
        <View style={styles.rightView}>
          <Image source={{uri: item.full_image}} style={styles.catImg} />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    // width: SIZES.fourtyFive,
    flex:1,
    // height: 100,
    backgroundColor: COLORS.categoryBackground,
    borderRadius: SIZES.minor,
    padding: SIZES.base,
    marginHorizontal: SIZES.base,
    marginTop: SIZES.padding,
    flexDirection: 'row',
  },
  innerContainer: {flex:1,flexDirection: 'row', justifyContent: 'space-between'},
  leftView: {
    flex:0.6,
    // alignItems:"center",
    justifyContent:"center"
    // width: SIZES.fifty,
    // justifyContent: 'space-between',
    // backgroundColor:"red"
  },
  txt: {...FONTS.body4_bold, marginBottom: 5},
  img: {width:18,height:18,marginVertical:SIZES.minor,},
  rightView: {
    // width: SIZES.fifty, 
    flex:0.4,
    justifyContent:"center",
    alignItems:"center",
    // paddingLeft: 2,
    // backgroundColor:"blue"
  },
  catImg: {
    // width: SIZES.fifty,
    // height: undefined,
    // width:"70%",
    // flex:1,
    width:"100%",
    height:70,

    aspectRatio: 0.6,
    resizeMode: 'contain',
  },
});
export default CategoryTile;
