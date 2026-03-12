import React, { useEffect, useState } from "react";
import { TouchableOpacity, Dimensions, SafeAreaView, StyleSheet, Image, View, FlatList, Platform, Alert } from 'react-native';
import { Loader, Button, Text, NoData, ImageIcon, ImageFast, Header } from '../component'
import { constants, images, colors, styleApp, dimens, spacing } from '../constants'
import { useDispatch, useSelector } from 'react-redux';
import { userId, getCart } from '../utils/Session'
import MealDetailItem from '../listitem/MealDetailItem'


var isFirstTime = true;
function Cart({ route, navigation }) {
    const dispatch = useDispatch();
    const [isFetching, setIsFetching] = useState(false);
    const [cartList, setCartList] = useState({})

    useEffect(() => {
        isFirstTime = true;
        init();
        const unsubscribe = navigation.addListener('focus', () => {
            init();
          });
        return () => {
            isFirstTime = true;
            unsubscribe();
        }
    }, []);

    async function init() {
        var menuItem = await getCart();
        console.log('menuItem ', menuItem)
        isFirstTime = false;
        setCartList(menuItem)

    }
    function NoDataView() {
        if (isFirstTime) return;
        return (<NoData
            btnTxt='Go Back to meals'
            onButtonClick={() => navigation.navigate('Meals')}
            image={images.nocart}
            textOne={"hamba! Don't wait to add dinner,"}
            textTwo={" You didn’t have added any tiffins yet.\nStart hunting delicious food with our team."} />)
    }

    function OnRowClick(position, item, type) {
        console.log('click : ', position + ' item : ', item);
        var itemObj = {
            restaurant_id: item.id,
            fullObj: item
        }
        navigation.navigate('MealDetail', { item: itemObj });
    }
    return (
        <SafeAreaView style={styleApp.safeAreaRoot}>
            <View style={styleApp.container}>
                <Loader loading={isFetching} />
                <Header titleLeft title="MyCart" />
                <View style={[styleApp.container, spacing.viewPadding]}>
                    {/* {NoDataView()} */}
                    {cartList.hasOwnProperty('id') ?
                        <MealDetailItem item={cartList} index={0} isFromCart={true}
                            onClick={OnRowClick} /> : NoDataView()}
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

});
export default Cart;