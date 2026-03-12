import React, { useEffect, useState } from "react";
import { SafeAreaView, TouchableOpacity,StyleSheet, View } from 'react-native';
import { Loader, Text, NoData, ImageIcon, ImageFast, Header } from '../component'
import { constants, images, colors, styleApp, dimens, spacing } from '../constants'
import FavoriteList from '../listitem/FavoriteList'

import { apiGetFavoriteDish, apiFavoriteMeal } from '../redux/api'
import { useDispatch, useSelector } from 'react-redux';
import { getFavoriteDishS } from "../redux/reducers/AppReducer";
// import { getFavoriteDishS, getUnFavoriteDishS } from '../redux/actions/ActionCB'

var isApiFavorite = false;
function Favorites({ route, navigation }) {
    const dispatch = useDispatch();
    const [isFetching, setIsFetching] = useState(false);

    //Access Redux Store State
    const dataReducer = useSelector((state) => state.AppReducer);
    const { favoriteDish } = dataReducer;

    useEffect(() => {
        callGetFavoriteDish();
        return () => {
            isApiFavorite = false
            console.log('COMPONENT  unmount');
        }
    }, []);

    function callGetFavoriteDish() {
        if (favoriteDish?.length <= 0) setIsFetching(true)
        apiGetFavoriteDish()
            .then(res => {
                isApiFavorite = true
                console.log("apiGetFavoriteDish res ", res)
                dispatch(getFavoriteDishS(res))
            })
            .catch(error => alert(error))
            .finally(() => { setIsFetching(false) });
    }

    function callUnFavoriteDish(favourite_id ,isDeleteAll) {
        setIsFetching(true)
        var bodyFormData = {}
        bodyFormData["favourite_id"]= favourite_id
        bodyFormData["is_delete_all"]= isDeleteAll

        // var bodyFormData = new FormData();
        // bodyFormData.append('favourite_id', favourite_id);
        // bodyFormData.append('is_delete_all',isDeleteAll)
        setIsFetching(true)
        apiFavoriteMeal(bodyFormData)
            .then(res => {
                console.log(res)
                if(!isDeleteAll){
                    var count = 0;
                    for (const item of favoriteDish) {
                        if (item.favourite_id == favourite_id) {
                            console.log('INDEx : ', count);

                            
                            // favoriteDish.splice(count, 1);
                            callGetFavoriteDish();
                            break;
                        }
                        count++;
                    }
                }else{
                    // favoriteDish.splice(0, favoriteDish.length);
                    callGetFavoriteDish();
                }
                
            })
            .catch(error => alert(error))
            .finally(() => {
                setIsFetching(false)
            });
    }


    function OnMealEvent(index, item, type) {
        switch (type) {
            case 1 :
                var itemObj = {
                    restaurant_id: item.id,
                }
                navigation.navigate('MealDetail', {item : itemObj});
                break;
            case 2:
                callUnFavoriteDish(item.favourite_id,0)
                break;
        }
    }
    function setFavorite() {
        if (favoriteDish?.length <= 0) {
            return (<NoData
                isFirst={!isApiFavorite}
                onButtonClick={() => navigation.goBack()}
                image={images.nofavorite}
                btnTxt='Go Back To Meals'
                textOne={"WOO-WOO! TREASURED ONE"}
                textTwo={"You didn't have any meals saved\nSaving meals hepls you checkout faster."} />)
        } else {
            return (
                <View style={spacing.viewPaddingHorizontal}>
                    <FavoriteList
                        listData={favoriteDish}
                        onClick={OnMealEvent} /></View>
            )
        }
    }

    return (
        <SafeAreaView style={styleApp.safeAreaRoot}>
            <View style={styleApp.container}>
                <Loader loading={isFetching} />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                        <Header titleLeft title="Favourites" />
                    </View>
                    {favoriteDish?.length > 0 ?
                    <TouchableOpacity onPress={() => {
                        callUnFavoriteDish(0,1)
                    }}>
                        <Text medium px14 white 
                        style={[styles.lblVegetableOnlyStyle]}>Remove All</Text>
                    </TouchableOpacity>:null}
                </View>

                <View style={[styleApp.container]}>
                    {setFavorite()}

                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    lblVegetableOnlyStyle: {
        backgroundColor: colors.primary,
        paddingHorizontal: dimens.w3,
        paddingVertical: dimens.w1,
        overflow: 'hidden',
        borderRadius: constants.borderRadius,
        textAlign: 'center',
        marginEnd : dimens.w4,
        backgroundColor: colors.primary
    }
});
export default Favorites;