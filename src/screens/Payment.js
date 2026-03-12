import React, { useEffect, useState } from "react";
import { TouchableOpacity, Dimensions, SafeAreaView, StyleSheet, Image, View, FlatList, Platform, Alert } from 'react-native';
import { Loader, Button, Text, NoData, ImageIcon, ImageFast, Header } from '../component'
import { constants, images, colors, styleApp, dimens, spacing } from '../constants'
import TiffinPlanList from '../listitem/TiffinPlanList'

import { apiViewOrder } from '../redux/api'
import { useDispatch, useSelector } from 'react-redux';
import { getViewOrderS } from "../redux/reducers/AppReducer";
// import { getViewOrderS, } from '../redux/actions/ActionCB'

var isApiCall = true;
export default function Payment({ route, navigation }) {
    const dispatch = useDispatch();
    const [isFetching, setIsFetching] = useState(false);

    //Access Redux Store State
    const dataReducer = useSelector((state) => state.AppReducer);
    const { viewOrders } = dataReducer;

    useEffect(() => {
        isApiCall = true
        callMyTiffin()
        return () => {
            isApiCall = true
            console.log('COMPONENT  unmount');
        }
    }, []);

    function callMyTiffin(id) {
        setIsFetching(true)
        apiViewOrder()
            .then(res => {
                isApiCall = false
                dispatch(getViewOrderS(res))
            })
            .catch(error => alert(error))
            .finally(() => setIsFetching(false));
    }


    function OnRowClick({ }) {

    }

    function setMyTiffin() {
        if (viewOrders.length <= 0) {
            return (<NoData
                btnTxt='Go Back to Meals'
                onButtonClick={() => navigation.reset({
                    index: 0,
                    routes: [{ name: 'TabStack' }],
                })}
                image={images.nopayment}
                textOne={"CHEERS! To my secure payments"}
                textTwo={"You didn't have any payments remaining."} />)
        } else {
            return (<View style={{ flex: 1, }}>
                <TiffinPlanList
                    isFromPayment={true}
                    listData={viewOrders}
                    onClick={OnRowClick} />
            </View>)
        }

    }

    return (
        <SafeAreaView style={styleApp.safeAreaRoot}>
            <View style={styleApp.container}>
                <Loader loading={isFetching} />
                <Header titleLeft title="Payments" />
                <View style={[styleApp.container]}>
                    {!isApiCall ?  setMyTiffin() : null}
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

});