import React, { useEffect, useState, useRef } from "react";
import { TouchableOpacity, Dimensions, SafeAreaView, StyleSheet, Image, View, FlatList, Platform, Alert } from 'react-native';
import { Loader, Button, Text, TextInputView, ImageIcon, NoData, Header } from '../component'
import { constants, images, colors, styleApp, dimens, spacing } from '../constants'
import MenuDetailsList from '../listitem/MenuDetailList'
import RBSheet from "react-native-raw-bottom-sheet";
import MealCategoryList from '../listitem/MealCategoryList'

import { getRestaurant, apiGetMealCategory, apiFavoriteMeal } from '../redux/api'
import { useDispatch, useSelector } from 'react-redux';
// import { getRestaurantAction, getMealCategoryList } from '../redux/actions/HomeActionCB'
import { isLoggedIn } from "../utils/Session";

import Login from './Login'
import { EventEmitter}from '../utils/event'
import GuestLogin from "./GuestLogin";
import { getMealCategoryList, getRestaurantAction } from "../redux/reducers/MealReducer";

var categoryObject = null;
var categoryId = 0;
var subCategoryId = 0;
var isApiFirst = true;

function MealListByCat({ route, navigation }) {

    const dispatch = useDispatch();
    const [isFetching, setIsFetching] = useState(false);
    const [currentCategory, setCurrentCategory] = useState('');
    const [subCategoryName, setSubCategoryName] = useState('');
    const [isVeg, setIsVeg] = useState(true);
    const [isGuest, setGuest] = useState(false)

    //Access Redux Store State
    const dataReducer = useSelector((state) => state.MealReducer);
    const { restaurantList, mealCategorys, selectedLatLng } = dataReducer;

    const categoryRefs = useRef();
    const guestLoginRefs = useRef();
    useEffect(() => {
        // params Object
        // var item = {
        //     category_id: categorySelected.id,
        //     subcategory_id : 0,
        //     category_name: categorySelected.category_name
        // }
        categoryObject = route.params.item;
        if (categoryObject != null) {
            setCurrentCategory(categoryObject.category_name)
            categoryId = categoryObject.category_id;
            subCategoryId = categoryObject.subcategory_id
            callApiGetRestaurant(categoryId, true);
            setTimeout(() => {
                callGetMealCategory(false);
            }, 300);
        }
        // try {
        //     EventEmitter.subscribe('GuestLoginACtion', (event) => {
        //         constants.isGuestLogin = false
        //         console.log('guestLoginRefs :: ',guestLoginRefs.current)
        //         console.log('asdjsajdsadjakdjlasdjasdjklsdjlasjdkalsdjk')
        //         try {
        //             guestLoginRefs.current.close()    
        //         } catch (error) {
        //         }
                
        //     })
        // } catch (error) {

        // }

        return () => {
            categoryObject = null;
            categoryId = 0;
            subCategoryId = 0
            isApiFirst = true;
            console.log('COMPONENT  unmount');
        }
    }, []);


    function callApiGetRestaurant(catId, is_veg) {
        console.log("isVegisVeg ", is_veg)

        var bodyFormData = {}
        bodyFormData["user_id"] = constants.user_id
        bodyFormData["category_id"] = catId
        bodyFormData["is_type"] = is_veg ? 2 : 1
        bodyFormData["home_lat"] = selectedLatLng.lat
        bodyFormData["home_lng"] = selectedLatLng.lng

        

        // var bodyFormData = new FormData();
        // bodyFormData.append('user_id', constants.user_id);
        // bodyFormData.append('category_id', catId);
        // bodyFormData.append('is_type', is_veg ? 2 : 1);
        // bodyFormData.append('home_lat', selectedLatLng.lat);
        // bodyFormData.append('home_lng', selectedLatLng.lng);
        // if (subCategoryId > 0) bodyFormData.append('subcategory_id', subCategoryId)

        if (subCategoryId > 0) bodyFormData["subcategory_id"] =  subCategoryId

        console.log('**** Req MealListByCat ', bodyFormData)
        setIsFetching(true)
        getRestaurant(bodyFormData)
            .then(res => {

                console.log("getRestaurant res : ",JSON.stringify(res))
                isApiFirst = false;
                if (res.data != null && res.data.length > 0) {
                    setSubCategoryName(res.data[0].title + ' Meal')
                }
                dispatch(getRestaurantAction(res.data))
            })
            .catch(error => setTimeout(() => {
                alert(error)
            }, 500))
            .finally(() => setIsFetching(false));
    }

    function callGetMealCategory(isLoading) {
        if (isLoading) setIsFetching(true)
        apiGetMealCategory()
            .then(res => {
                console.log("apiGetMealCategory res : ",JSON.stringify(res))

                dispatch(getMealCategoryList(res))
                if (isLoading) categoryRefs.current.open()
            })
            .catch(error => alert(error))
            .finally(() => {
                if (isLoading) setIsFetching(false)
            });
    }

    async function callFavoriteMeal(restaurant_id, favourite_id, subcategory_id) {
        var isLogin = await isLoggedIn()
        if (isLogin <= 0) {
            constants.isGuestLogin =true;
            setGuest(!isGuest)
            return;
        }
        var bodyFormData = {}
        bodyFormData["restaurant_id"] = restaurant_id

        // var bodyFormData = new FormData();
        // bodyFormData.append('restaurant_id', restaurant_id);
        // if (favourite_id > 0) bodyFormData.append('favourite_id', favourite_id);
        
        if (favourite_id > 0)  bodyFormData["favourite_id"] =  favourite_id;
        setIsFetching(true)
        apiFavoriteMeal(bodyFormData)
            .then(res => {
                console.log("apiFavoriteMeal : ",res)
                var isFavoriteAdded = res.data != null && res.data.hasOwnProperty('id')
                for (const item of restaurantList) {
                    if (item.id == subcategory_id) {
                        var restaurantAray = item.data;
                        for (const restItem of restaurantAray) {
                            if (restItem.id == restaurant_id) {
                                restItem.favourite_id = isFavoriteAdded ? res.data.id : 0
                                break;
                            }
                        }
                        break;
                    }
                }

                callApiGetRestaurant(categoryId, true);
                setTimeout(() => {
                    callGetMealCategory(false);
                }, 300);
            })
            .catch(error => alert(error))
            .finally(() => {
                setIsFetching(false)
            });
    }

    function setList() {
        console.log('restaurantList ', restaurantList)
        if (restaurantList == null || restaurantList.length <= 0) {
            return (<NoData
                image={images.notfound}
                textOne={"oopsy! No results found"}
                textTwo={""} />)
        }
        return (
            <MenuDetailsList
                listData={restaurantList}
                onClick={OnSelectMeal} />
        )

    }

    function bottomCategory() {
        return (<RBSheet
            ref={categoryRefs}
            // height={100}
            duration={250}
            customStyles={{
                container: {
                    // justifyContent: "center",
                    // alignItems: "center"
                }
            }}>
            <View style={{ width: '100%', padding: dimens.w3 }}>
                <Text boldSemi px20 black50 style={{ marginTop: dimens.h1 }}>Select Category</Text>
                <MealCategoryList
                    listData={mealCategorys}
                    onClick={OnMealCatClick} />
            </View>

        </RBSheet>)
    }

    function onLoginAction(params) {
        
    }
    function guestLogin() {
        return (<View>
            <RBSheet
              ref={guestLoginRefs}
                height={dimens.h70}
                customStyles={{
                    container: {
                        borderTopRightRadius: dimens.w5,
                        borderTopLeftRadius: dimens.w5
                    }
                }}
            >
                <Login isFromGuest={true} onLoginAction={onLoginAction} />
            </RBSheet>
        </View>)
    }

    function OnMealCatClick(position) {
        categoryRefs.current.close();
        subCategoryId = 0;
        console.log(mealCategorys[position])
        setCurrentCategory(mealCategorys[position].category_name)
        setSubCategoryName(mealCategorys[position].category_name + ' Meal')
        setTimeout(() => {
            callApiGetRestaurant(mealCategorys[position].id, isVeg)
        }, 500);

    }

    function OnSelectMeal(position, item, type) {
        console.log('click : ', position + ' item : ', item);
        switch (type) {
            case 1:
                var itemObj = {
                    restaurant_id: item.id,
                    fullObj: item
                }
                navigation.navigate('MealDetail', { item: itemObj });
                break;
            case 2:
                callFavoriteMeal(item.id, item.favourite_id, item.subcategory_id)
                break;
        }

    }

    function openBottomCategory() {
        if (mealCategorys == null || mealCategorys.length <= 0) {
            callGetMealCategory(true);
        } else {
            categoryRefs.current.open()
        }

    }
    return (
        <SafeAreaView style={styleApp.safeAreaRoot}>
            <Loader loading={isFetching} />

            {isApiFirst ? <View /> :
                <View style={styleApp.container}>
                    {/* {guestLogin()} */}
                    {bottomCategory()}

                    {/** Header */}
                    <View style={[styles.headerRoot, spacing.viewPaddingHorizontal]}>
                        <ImageIcon big path={images.back} onClick={() => navigation.goBack()} />
                        <View style={{ flex: 1, flexDirection: 'column', marginStart: dimens.w3, marginEnd: dimens.w20 }}>
                            {/** Search Dropdown Open */}
                            <TouchableOpacity onPress={() => openBottomCategory()}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text medium px14 color="#666666" style={{ marginTop: dimens.w1 }}>{currentCategory} </Text>
                                    <ImageIcon
                                        style={{ width: dimens.w3, height: dimens.w3 }}
                                        path={images.down} />
                                </View>
                            </TouchableOpacity>
                            <Text boldSemi px22 black numberOfLines={1}>{subCategoryName}</Text>
                        </View>
                        {/** FILTER veg -no veg */}
                        <TouchableOpacity onPress={() => {
                            setIsVeg(!isVeg)
                            callApiGetRestaurant(categoryId, !isVeg)
                        }}>

                            <Text color={!isVeg ? colors.white : colors.primary}
                                medium px14 style={[styles.lblVegetableOnlyStyle, { backgroundColor: !isVeg ? colors.primary : colors.white }]}>
                                Veg Only</Text>
                        </TouchableOpacity>
                    </View>
                    {/** Divider */}
                    <View style={{ backgroundColor: colors.divider, width: '100%', height: 0.5, }}></View>
                    <View style={[spacing.viewPaddingHorizontal, { flex: 1 }]}>
                        {setList()}
                    </View>
                    {isGuest?<GuestLogin isShow={isGuest} navigation={navigation}
                     onFinish={()=>setGuest(false)}/> : null}
                </View>}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    headerRoot: {
        flexDirection: 'row', alignItems: 'center',
        marginStart: constants.headerIconMarginStart,
        marginTop: constants.marginTopHeader
    },
    lblVegetableOnlyStyle: {
        backgroundColor: colors.primary,
        paddingHorizontal: dimens.w3,
        paddingVertical: dimens.w1,
        overflow: 'hidden',
        borderRadius: constants.borderRadius,
        textAlign: 'center',
        borderWidth: constants.borderWidth,
        borderRadius: constants.borderRadius,
        borderColor: colors.primary
    }
})

export default MealListByCat;