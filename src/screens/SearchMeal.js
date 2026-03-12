import React, { useEffect, useState } from "react";
import { TouchableOpacity, TextInput, SafeAreaView, StyleSheet, Image, View, FlatList, Platform, Alert } from 'react-native';
import { Loader, Button, Text, TextInputView, ImageIcon, NoData, Header } from '../component'
import { constants, images, colors, styleApp, dimens, spacing } from '../constants'
import MealCategoryList from '../listitem/MealCategoryList'

import { apiGetMealCategory } from '../redux/api'
import { useDispatch, useSelector } from 'react-redux';
import { getMealCategoryList } from '../redux/actions/HomeActionCB'


var categoryArrayholder = [];
var isApiFirstTime =true;

function SearchMeal({ route, navigation }) {
    const dispatch = useDispatch();

    //Access Redux Store State
    // const dataReducer = useSelector((state) => state.mealReducer);
    // const {  mealCategorys } = dataReducer;

    const [isFetching, setIsFetching] = useState(false);
    const [searchMenu, setSearchMenu] = useState('');
    const [category, setCategory] = useState([]);

    useEffect(() => {
        isApiFirstTime =true
        setTimeout(() => {
            callGetMealCategory();
        }, 200);
        return () => {
            isApiFirstTime =true;
        }
    }, []);

    function callGetMealCategory() {
        if (category == null || category.length <= 0) setIsFetching(true)
        apiGetMealCategory()
            .then(res => {
                categoryArrayholder = res;
                setCategory(res);
                // dispatch(getMealCategoryList(res))
            })
            .catch(error => alert(error))
            .finally(() => {
                isApiFirstTime =false;
                setIsFetching(false)
            });
    }

    function onSearchText(text) {
        let filteredData = categoryArrayholder.filter(function (item) {
            return (item.category_name.toLowerCase().includes(text.toLowerCase()));
        });
        setSearchMenu(text)
        setCategory(filteredData);
    }

    function OnMealCatClick(position) {
        var categorySelected = category[position];
        var item = {
            category_id: categorySelected.id,
            subcategory_id : 0,
            category_name: categorySelected.category_name
        }
        navigation.navigate('MealListByCat', { item : item });
    }

    function setMealCategoryList() {
        if(isApiFirstTime)return (<View/>)
        if (category.length <= 0) {
            return (<NoData
                image={images.notfound}
                textOne={"oopsy! No results found"}
                textTwo={"Please check the spelling or try a different search"} />)
        } else {
            return (<View style={{ flex: 1, marginVertical: dimens.w7 }}>
                <MealCategoryList
                    listData={category}
                    onClick={OnMealCatClick} />
            </View>)
        }

    }

    return (
        <SafeAreaView style={styleApp.safeAreaRoot}>
            <View style={styleApp.container}>
                <Loader loading={isFetching} />
                <View style={[styles.searchRoot, spacing.viewPaddingHorizontal]}>
                    <ImageIcon big path={images.cancel}
                        onClick={() => navigation.goBack()} />
                    <View style={styles.viewSearchMenuStyle}>
                        <TextInput
                            style={styles.textInputSearchMenuStyle}
                            placeholder='Search for meals or area'
                            placeholderTextColor={colors.fontPlaceHolder}
                            autoCapitalize='none'
                            flex={1}
                            returnKeyType='done'
                            maxLength={30}
                            numberOfLines={1}
                            selectionColor={colors.black}
                            value={searchMenu}
                            onChangeText={text => {
                                onSearchText(text)
                            }}>
                        </TextInput>
                        <ImageIcon
                            touchableStyle={{ paddingHorizontal: dimens.w3 }}
                            path={images.search} />
                    </View>
                </View>

                <View style={[styleApp.container, spacing.viewPaddingHorizontal, { marginHorizontal: dimens.w4 }]}>
                    {setMealCategoryList()}

                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    searchRoot: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: constants.marginTopHeader,
        marginStart: constants.headerIconMarginStart
    },
    viewSearchMenuStyle:
    {
        backgroundColor: colors.bgGray,
        borderRadius: constants.borderRadius,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: dimens.w1,
        flex: 1,
        marginStart: dimens.w2,
    },
    textInputSearchMenuStyle:
    {
        color: colors.black,
        paddingHorizontal: dimens.w3,
        paddingVertical: constants.isAndroid ? dimens.wo5 : dimens.w3,
    }, icLocation: {
        backgroundColor: colors.bgGray, padding: dimens.w3, borderRadius: constants.borderRadius,
    },
});
export default SearchMeal;