import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, FlatList, Text, Image, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { callNonTokenApi } from '../../helpers/ApiRequest';
import config from '../../constants/config';
import { COLORS, SIZES } from '../../constants/theme';
import globalStyles from '../../constants/global-styles';
import { ScrollView } from 'react-native-gesture-handler';
import * as RootNavigation from '@navigators/RootNavigation';



const SearchTextField = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState();
    const [dropdown, setDropdown] = useState(false)
    const animatedvalue = useRef(new Animated.Value(0)).current;
    const [searchDone, setSearchDone] = useState(false);
    const slidedown = () => {
        Animated.timing(animatedvalue, {
            toValue: 300,
            duration: 500,
            useNativeDriver: false,
        }).start()
    }
    const slideup = () => {

        Animated.timing(animatedvalue, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,

        }).start(() => setDropdown(false))
    }

    useEffect(() => {
        callNonTokenApi(config.apiName.searchTerm, 'POST', {
            'term': query
        })
            .then(response => {
                if (response.status == 200) {
                    if (response.data.count > 1) {
                        setSuggestions(response.data.products)
                        setDropdown(true)
                        slidedown()
                    } else {
                        setSuggestions([]);
                        setDropdown(false)
                        slideup()
                    }

                }
            })
            .catch(error => console.error('Error fetching suggestions:', error));
    }, [query]);

    return (
        <View>
            <View style={[styles.wrapper]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <TextInput
                        style={[globalStyles.textInput, { padding: 0, height: 20, flex: 1 }]}
                        outlineStyle={globalStyles.textInputOutline}
                        mode="outlined"
                        placeholderTextColor={COLORS.grayLight}
                        textColor={COLORS.black}
                        placeholder={'Search...'}
                        value={query}
                        onChangeText={(val) => {
                            setQuery(val)
                        }}
                    />
                </View>
            </View>
            {
                (dropdown)
                    ?
                    <Animated.View style={[{ maxHeight: animatedvalue }, styles.dropdown]}>
                        <ScrollView contentContainerStyle={{ paddingVertical: 10, overflow: 'hidden' }} nestedScrollEnabled={true}>

                            {
                                (suggestions.length >= 1)
                                    ?
                                    suggestions.map((item, index) => {

                                        return (
                                            <TouchableOpacity style={styles.option} key={index} onPress={() => {
                                                slideup()
                                                setQuery('')
                                                RootNavigation.navigate('ProductDetail', { item: item });
                                            }}>
                                                <View style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center'
                                                }}>
                                                    <Image style={{
                                                        height: 30,
                                                        width: 30,
                                                        marginRight: 12
                                                    }} source={{ uri: item.full_image }} />
                                                    <Text style={{
                                                        marginRight: 12
                                                    }}>{item.name}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    })
                                    :
                                    <TouchableOpacity style={styles.option} onPress={() => {

                                    }}>
                                        <Text > Not Found </Text>
                                    </TouchableOpacity>
                            }



                        </ScrollView>
                    </Animated.View>
                    :
                    null
            }
        </View>
    );
};

export default SearchTextField;

const styles = StyleSheet.create({
    wrapper: { borderWidth: 1, position: 'relative', backgroundColor: COLORS.white, borderRadius: 10, borderColor: 'gray', paddingHorizontal: 20, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between' },
    dropdown: { borderWidth: 1, backgroundColor: COLORS.white, borderRadius: 10, borderColor: 'gray', overflow: 'hidden', position: 'absolute', top: 50, width: SIZES.hundred },
    option: { paddingHorizontal: 20, paddingVertical: 8, overflow: 'hidden' },
    disabledoption: { paddingHorizontal: 20, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', backgroundColor: 'whitesmoke', opacity: 0.9 }

})
