import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  MasterLayout,
  CartBar,
  Input,
  IconBtn,
  Hr,
  Phrase,
  ProductWidget,
  Spacer,
} from '@components';
import { COLORS, SIZES, FONTS } from '@constants/theme';
import globalStyles from '@constants/global-styles';
import { search, filter, close, checked, unchecked } from '@constants/icons';
import { styles } from './styles';
import { product1 } from '@constants/images';
import { useFocusEffect } from '@react-navigation/native';
import config from '../../constants/config';
import { callNonTokenApi } from '../../helpers/ApiRequest';
import { useDispatch, useSelector } from 'react-redux';
import { MyButton, SearchTextField } from '../../components';
import { setLoader } from '../../store/reducers/global';

const ProductListing = ({ route }) => {
  const global = useSelector(state => state.global);
  const dispatch = useDispatch();
  const { namE, slug, type } = route.params;
  const [searchText, setSearchText] = useState('')

  const [newArrivals, setNewArrivals] = useState(null)
  const [name, setName] = useState(namE)
  const [scene, setScene] = useState('Listing');

  const [ageFilters, setAgeFilters] = useState(global.allAges);
  const [categoriesFilters, setCategoriesFilters] = useState(global.allCategories);
  const [brandFilters, setBrandFilters] = useState(global.allBrands);
  const [priceFilters, setPriceFilters] = useState(global.allPrices);

  const [ageSF, setAgeSF] = useState([])
  const [categoriesSF, setCategoriesSF] = useState([])
  const [brandSF, setBrandSF] = useState([])
  const [priceSF, setPriceSF] = useState([])

  // const [ageFilters, setAgeFilters] = useState([
  //   { title: '1-3', id: '1-3', checked: false },
  //   { title: '4-7', id: '4-7', checked: false },
  //   { title: '8-10', id: '8-10', checked: false },
  //   { title: '11-12', id: '11-12', checked: false },
  //   { title: '13+', id: '13+', checked: false },
  // ]);
  // const [categoriesFilters, setCategoriesFilters] = useState([
  //   { title: 'Category 1', id: '1', checked: false },
  //   { title: 'Category 2', id: '2', checked: false },
  //   { title: 'Category 3', id: '3', checked: false },
  //   { title: 'Category 4', id: '4', checked: false },
  //   { title: 'Category 5', id: '5', checked: false },
  //   { title: 'Category 6', id: '6', checked: false },
  // ]);
  // const [brandFilters, setBrandFilters] = useState([
  //   { title: 'Brand 1', id: '1', checked: false },
  //   { title: 'Brand 2', id: '2', checked: false },
  //   { title: 'Brand 3', id: '3', checked: false },
  //   { title: 'Brand 4', id: '4', checked: false },
  //   { title: 'Brand 5', id: '5', checked: false },
  //   { title: 'Brand 6', id: '6', checked: false },
  // ]);
  // const [priceFilters, setPriceFilters] = useState([
  //   { value: [5, 10], title: '5-10', id: '5-10', checked: false },
  //   { value: [11, 25], title: '11-25', id: '11-25', checked: false },
  //   { value: [26, 51], title: '26-51', id: '26-51', checked: false },
  //   { value: [52, 100], title: '52-100', id: '52-100', checked: false },
  //   { value: [101, 200], title: '101-200', id: '101-200', checked: false },
  //   { value: [201, 100000], title: '201+', id: '201+', checked: false },
  // ]);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     setName(slug)
  //     const unsubscribe = setScene('Listing');
  //   }, []),
  // );
  useEffect(() => {
    setNewArrivals(null)
    dispatch(setLoader(true))
    fetchData();

  }, []);

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Phrase
        txt={`No Record Found`}
        txtStyle={styles.filterItemTxt}
      />
    </View>
  );


  const fetchData = async () => {
    dispatch(setLoader(true))
    console.log(`${config.apiName.productList}/${type}/${slug}`)
    callNonTokenApi(
      `${config.apiName.productList}/${type}/${slug}`,
      'GET',
    )
      .then(res => {
        // console.log(res.products);
        setNewArrivals(res.data.products)
        setName(res.data.name)
        dispatch(setLoader(false))
      })
      .catch(error => {
        console.log(error)
        // setApiFailModal(true);
      });
  };

  const applyFilters = async () => {


  };

  const onApplyFilterPressed = (applied = false) => {
    dispatch(setLoader(true))

    if (!applied) {
      ageFilters.map((item) => {
        if (item.checked) {
          console.log(item.checked)
          ageSF.push(item.value)
        }
      })
    }
    categoriesFilters.map((item) => {
      if (item.checked) {
        categoriesSF.push(item.id)
      }
    })

    brandFilters.map((item) => {
      if (item.checked) {
        brandSF.push(item.id)
      }
    })

    priceFilters.map((item) => {
      if (item.checked) {
        priceSF.push(item.value)
      }
    })

    console.log(`${config.apiName.search}`, categoriesSF, ageSF, brandSF, priceSF)
    callNonTokenApi(
      `${config.apiName.search}`,
      'POST',
      {
        "sortBy": "created_at",
        "categories": categoriesSF,
        "brands": brandSF,
        "ages": ageSF,
        "prices": priceSF
      }
    )
      .then(res => {
        // console.log(res.products);
        setNewArrivals(res.data.products)
        dispatch(setLoader(false))
        setScene('Listing');
        setAgeSF([])
        setCategoriesSF([])
        setBrandSF([])
        setPriceSF([])
      })
      .catch(error => {
        dispatch(setLoader(false))
        console.log(error)
        setScene('Listing');

        // setApiFailModal(true);
      });
  }



  const handleCheckboxChange = (filterType, index) => {
    switch (filterType) {
      case 'age':
        let updatedAgeFilters = [...ageFilters];
        updatedAgeFilters[index] = {
          ...updatedAgeFilters[index],
          checked: !updatedAgeFilters[index].checked
        };
        setAgeFilters(updatedAgeFilters);
        console.log('Age Filters:', updatedAgeFilters);
        break;
      case 'brand':
        const updatedBrandFilters = [...brandFilters];
        updatedBrandFilters[index] = {
          ...updatedBrandFilters[index],
          checked: !updatedBrandFilters[index].checked
        };
        setBrandFilters(updatedBrandFilters);
        console.log('Brand Filters:', updatedBrandFilters);
        break;
      case 'categories':
        const updatedCategoriesFilters = [...categoriesFilters];
        updatedCategoriesFilters[index] = {
          ...updatedCategoriesFilters[index],
          checked: !updatedCategoriesFilters[index].checked
        };
        setCategoriesFilters(updatedCategoriesFilters);
        console.log('Categories Filters:', updatedCategoriesFilters);
        break;
      case 'price':
        const updatedPriceFilters = [...priceFilters];
        updatedPriceFilters[index] = {
          ...updatedPriceFilters[index],
          checked: !updatedPriceFilters[index].checked
        };
        setPriceFilters(updatedPriceFilters);
        console.log('Price Filters:', updatedPriceFilters);
        break;
      default:
        break;
    }
  };
  return (
    <MasterLayout bgColor={COLORS.bgGray} scrolling={true} max={true}>


      {scene == 'Listing' ? (
        <>
          <View style={globalStyles.whiteBg}>
            <CartBar title={name} />
            <View style={[globalStyles.rowView, styles.searchRow]}>
              <View style={styles.searchRowLeft}>
                <SearchTextField />
              </View>
              <View style={styles.searchRowRight}>
                <IconBtn
                  icon={filter}
                  onPress={() => {
                    setScene('Filter');
                  }}
                />
              </View>
            </View>
            <Hr />
            <Phrase
              txt={'Select Age (years):'}
              txtStyle={styles.selectAgeTxt}
            />
            <Spacer />
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              data={ageFilters}
              renderItem={({ item, index }) => (
                <React.Fragment key={item.id}>
                  <TouchableOpacity
                    onPress={() => {
                      // handleCheckboxChange('age', index);
                      let updatedAgeFilters = [...ageFilters];
                      updatedAgeFilters[index] = {
                        ...updatedAgeFilters[index],
                        checked: !updatedAgeFilters[index].checked
                      };
                      setAgeFilters(updatedAgeFilters);
                      console.log('Age Filters:', updatedAgeFilters);
                      updatedAgeFilters.map((item) => {
                        if (item.checked) {
                          console.log(item.checked)
                          ageSF.push(item.value)
                        }
                      })
                      onApplyFilterPressed(true)
                    }}
                    style={[
                      styles.ageItem,
                      {
                        backgroundColor: item.checked
                          ? COLORS.secondary
                          : COLORS.bgGray,
                      },
                    ]}>
                    <Phrase
                      txt={item.title}
                      txtStyle={{
                        color: item.checked ? COLORS.white : COLORS.black,
                      }}
                    />
                  </TouchableOpacity>
                </React.Fragment>
              )}
              keyExtractor={item => item.id}
            />
          </View>
          <FlatList
            data={newArrivals}
            scrollEnabled={false}
            numColumns={2}
            renderItem={({ item }) => (
              <React.Fragment key={item.sku}>
                <ProductWidget item={item} />
              </React.Fragment>
            )}
            keyExtractor={item => item.sku}
            contentContainerStyle={styles.listingContainer}
            ListEmptyComponent={renderEmptyComponent}
          />

        </>
      ) : (
        <>
          <View style={globalStyles.whiteBg}>
            <View style={[globalStyles.rowView]}>
              <CartBar title={'Filters'} showCart={false} />
              <TouchableOpacity
                onPress={() => {
                  setScene('Listing');
                }}>
                <Image source={close} style={styles.crossImg} />
              </TouchableOpacity>
            </View>
          </View>
          <Spacer />
          <View
            style={[
              globalStyles.whiteBg,
              { flexDirection: 'row', flexWrap: 'wrap' },
            ]}>
            {ageFilters.map((item, index) => {
              if (item.checked) {
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.filterItem}
                    onPress={() => {
                      handleCheckboxChange('age', index);
                    }}>
                    <Phrase
                      txt={`Age: ${item.title}`}
                      txtStyle={styles.filterItemTxt}
                    />

                    <Image source={close} style={styles.filterItemImg} />
                  </TouchableOpacity>
                );
              }
            })}
            {categoriesFilters.map((item, index) => {
              if (item.checked) {
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.filterItem}
                    onPress={() => {
                      handleCheckboxChange('categories', index);
                    }}>
                    <Phrase
                      txt={`Category: ${item.name}`}
                      txtStyle={styles.filterItemTxt}
                    />

                    <Image source={close} style={styles.filterItemImg} />
                  </TouchableOpacity>
                );
              }
            })}
            {brandFilters.map((item, index) => {
              if (item.checked) {
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.filterItem}
                    onPress={() => {
                      handleCheckboxChange('brand', index);
                    }}>
                    <Phrase
                      txt={`Brand: ${item.name}`}
                      txtStyle={styles.filterItemTxt}
                    />

                    <Image source={close} style={styles.filterItemImg} />
                  </TouchableOpacity>
                );
              }
            })}

            {priceFilters.map((item, index) => {
              if (item.checked) {
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.filterItem}
                    onPress={() => {
                      handleCheckboxChange('price', index);
                    }}>
                    <Phrase
                      txt={`Price: ${item.title}`}
                      txtStyle={styles.filterItemTxt}
                    />

                    <Image source={close} style={styles.filterItemImg} />
                  </TouchableOpacity>
                );
              }
            })}
          </View>
          <Spacer />
          {/* Age Filter */}
          <View style={[globalStyles.whiteBg]}>
            <CartBar title={'Select Age'} showCart={false} />
            <Spacer />
            {ageFilters.map((filter, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.checkboxRow}
                  onPress={() => {
                    handleCheckboxChange('age', index);
                  }}>
                  <Image
                    source={filter.checked ? checked : unchecked}
                    style={styles.checkboxImg}
                  />
                  <Phrase txt={filter.title} txtStyle={styles.checkboxTxt} />
                </TouchableOpacity>
              );
            })}
          </View>
          {/* Age Filter */}
          <Spacer />
          {/* Categories Filter */}
          <View style={[globalStyles.whiteBg]}>
            <CartBar title={'Select Categories'} showCart={false} />
            <Spacer />
            {categoriesFilters.map((filter, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.checkboxRow}
                  onPress={() => {
                    handleCheckboxChange('categories', index);
                  }}>
                  <Image
                    source={filter.checked ? checked : unchecked}
                    style={styles.checkboxImg}
                  />
                  <Phrase txt={filter.name} txtStyle={styles.checkboxTxt} />
                </TouchableOpacity>
              );
            })}
          </View>
          {/* Categories Filter */}
          <Spacer />
          {/* Brands Filter */}
          <View style={[globalStyles.whiteBg]}>
            <CartBar title={'Select Brands'} showCart={false} />
            <Spacer />
            {brandFilters.map((filter, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.checkboxRow}
                  onPress={() => {
                    handleCheckboxChange('brand', index);
                  }}>
                  <Image
                    source={filter.checked ? checked : unchecked}
                    style={styles.checkboxImg}
                  />
                  <Phrase txt={filter.name} txtStyle={styles.checkboxTxt} />
                </TouchableOpacity>
              );
            })}
          </View>
          {/* Brands Filter */}
          <Spacer />
          {/* Price Filter */}
          <View style={[globalStyles.whiteBg]}>
            <CartBar title={'Select Price'} showCart={false} />
            <Spacer />
            {priceFilters.map((filter, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.checkboxRow}
                  onPress={() => {
                    handleCheckboxChange('price', index);
                  }}>
                  <Image
                    source={filter.checked ? checked : unchecked}
                    style={styles.checkboxImg}
                  />
                  <Phrase txt={filter.title} txtStyle={styles.checkboxTxt} />
                </TouchableOpacity>
              );
            })}
          </View>
          {/* Price Filter */}
          <MyButton
            label={<Text style={styles.productBtn}>Apply Filter</Text>}
            btnStyle={styles.btnStyle}
            txtColor={COLORS.white}
            btnColor={COLORS.secondary}
            borderColor={COLORS.secondary}
            onPress={onApplyFilterPressed}
          />
        </>
      )}

    </MasterLayout>
  );
};

export default ProductListing;

// Format for calling the Api
// {
//   "sortBy": "created_at",
//   "categories": [1,2,3,4,5],
//   "brands": [1,2,3,4,5],
//   "ages": ["1-3", "4-7", "13+"],
//   "prices": [[5,10], [11,25]]
// }




// const [ageFilters, setAgeFilters] = useState([
//   {title: 'All', id: 'All', checked: false},
//   {title: '0-2', id: '0-2', checked: false},
//   {title: '3+', id: '3+', checked: false},
//   {title: '5+', id: '5+', checked: false},
//   {title: '8+', id: '8+', checked: false},
//   {title: '11+', id: '11+', checked: false},
//   {title: '15+', id: '15+', checked: false},
// ]);
// const [categoriesFilters, setCategoriesFilters] = useState([
//   {title: 'All', id: 'All', checked: false},
//   {title: '0-2', id: '0-2', checked: false},
//   {title: '3+', id: '3+', checked: false},
//   {title: '5+', id: '5+', checked: false},
//   {title: '8+', id: '8+', checked: false},
//   {title: '11+', id: '11+', checked: false},
//   {title: '15+', id: '15+', checked: false},
// ]);
// const [brandFilters, setBrandFilters] = useState([
//   {title: 'All', id: 'All', checked: false},
//   {title: '0-2', id: '0-2', checked: false},
//   {title: '3+', id: '3+', checked: false},
//   {title: '5+', id: '5+', checked: false},
//   {title: '8+', id: '8+', checked: false},
//   {title: '11+', id: '11+', checked: false},
//   {title: '15+', id: '15+', checked: false},
// ]);
// const [priceFilters, setPriceFilters] = useState([
//   {title: 'All', id: 'All', checked: false},
//   {title: '0-2', id: '0-2', checked: false},
//   {title: '3+', id: '3+', checked: false},
//   {title: '5+', id: '5+', checked: false},
//   {title: '8+', id: '8+', checked: false},
//   {title: '11+', id: '11+', checked: false},
//   {title: '15+', id: '15+', checked: false},
// ]);


// const [ageFilters, setAgeFilters] = useState(global.allAges);
//   const [categoriesFilters, setCategoriesFilters] = useState(global.allCategories);
//   const [brandFilters, setBrandFilters] = useState(global.allBrands);
//   const [priceFilters, setPriceFilters] = useState(global.allPrices);