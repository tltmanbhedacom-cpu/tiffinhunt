import React, { useEffect, useState } from "react";
import { TouchableOpacity, Dimensions, SafeAreaView, StyleSheet, Image, View, FlatList, Platform, Alert } from 'react-native';
import { Loader, Button, Text, NoData, ImageIcon, ImageFast, Header } from '../component'
import { constants, images, colors, styleApp, dimens, spacing } from '../constants'
import TiffinPlanList from '../listitem/TiffinPlanList'

import { apiViewOrder } from '../redux/api'
import { useDispatch, useSelector } from 'react-redux';
import { getViewOrderS } from "../redux/reducers/AppReducer";
// import { getViewOrderS, } from '../redux/actions/ActionCB'

var isFirstApi = true;
function MyTiffinPlan({ route, navigation }) {
    const dispatch = useDispatch();
    const [isFetching, setIsFetching] = useState(false);

    //Access Redux Store State
    const dataReducer = useSelector((state) => state.AppReducer);
    const { viewOrders } = dataReducer;

    useEffect(() => {
        isFirstApi = true
        callMyTiffin()
        return () => {
            isFirstApi = true
        }
    }, []);

    function callMyTiffin() {
        setIsFetching(true)
        apiViewOrder()
            .then(res => {
                isFirstApi = false
                var list= res.filter( item => item.order_status == 0)
                dispatch(getViewOrderS(list))
            })
            .catch(error => alert(error))
            .finally(() => { setIsFetching(false) });
    }


    function OnRowClick(type, index, item) {
        console.log(item)
        switch (type) {
            case 1:
                var forParam = {
                    fullObj : null,
                    restaurant_id :item.restaurant_id
                }
                navigation.navigate('Meals', {
                    screen: 'MealDetail',
                    params: { item: forParam }
                })
                break;
            case 2:
                navigation.navigate('SkipPauseMeal', { item: item })
                //skip-pause
                break;
            case 3:
                navigation.navigate('Rating', { item: item })
                break;
        }
    }

    function setMyTiffin() {
        if (isFirstApi) return <View />
        if (viewOrders.length <= 0) {
            return (<NoData
                btnTxt='Go Back to Meals'
                onButtonClick={() => navigation.reset({
                    index: 0,
                    routes: [{ name: 'TabStack' }],
                })}
                image={images.noorders}
                textOne={"HIP-HIP! YOUR LUNCH IS HERE"}
                textTwo={"You didn't have ordered any tiffins yet.\nStart hunting delicious food with our team."} />)
        } else {
            return (<View style={{ flex: 1, }}>
                <TiffinPlanList
                    isFromPayment={false}
                    listData={viewOrders}
                    onClick={OnRowClick} />
            </View>)
        }

    }

    return (
        <SafeAreaView style={styleApp.safeAreaRoot}>
            <View style={styleApp.container}>
                <Loader loading={isFetching} />
                <Header titleLeft title="My Tiffins & Plans" />
                <View style={[styleApp.container]}>
                    {setMyTiffin()}
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

});
export default MyTiffinPlan;