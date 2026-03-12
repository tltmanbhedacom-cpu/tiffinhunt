import React, { useEffect, useState } from "react";
import { TouchableOpacity, Dimensions, SafeAreaView, StyleSheet, Image, View, FlatList, Platform, Alert } from 'react-native';
import { Loader, Button, Text, RatingBarSmile, ImageIcon, ImageFast, Header } from '../component'
import { constants, images, colors, styleApp, dimens, spacing, font, fontSize } from '../constants'

import { apiAddRating } from '../redux/api'
import { useDispatch, useSelector } from 'react-redux';

var planObj = {};
var isRatingApplyed = false;
export default function Rating({ route, navigation }) {
    const dispatch = useDispatch();
    const [isFetching, setIsFetching] = useState(false);
    const [rating, setRating] = useState(-1);
    const [ratingText] = useState(['Hated it', 'Disliked it', 'It was ok', 'Liked it', 'Loved it'])

    useEffect(() => {
        planObj = route.params.item;
        console.log('planObj', planObj)
        isRatingApplyed = false
        setRating(0)
        // if (planObj.rate_count > 0) {
        //     isRatingApplyed = true
        //     setRating(planObj.rate_count)
        // } else {
        //     isRatingApplyed = false
        //     setRating(0)
        // }
        return () => {
            console.log('COMPONENT  unmount');
        }
    }, []);


    function callApiRating() {
        var bodyFormData = {}
        bodyFormData["order_id"] = planObj.id
        bodyFormData["restaurant_id"] = planObj.restaurant_id
        bodyFormData["rate_value"] = rating


        // var bodyFormData = new FormData();
        // bodyFormData.append('order_id', planObj.id);
        // bodyFormData.append('restaurant_id', planObj.restaurant_id);
        // bodyFormData.append('rate_value', rating);

        setIsFetching(true)
        apiAddRating(bodyFormData)
            .then(res => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'TabStack' }],
                });
            })
            .catch(error => alert(error))
            .finally(() => { setIsFetching(false) });
    }
    return (
        <SafeAreaView style={styleApp.safeAreaRoot}>
            <View style={styleApp.container}>
                <Loader loading={isFetching} />
                {/** Header */}
                <View style={[styles.headerRoot, spacing.viewPaddingHorizontal]}>
                    <ImageIcon big path={images.cancel} onClick={() => navigation.goBack()} />
                    <View style={{ flex: 1, marginStart: dimens.w2 }}>
                        {/** Title Help */}
                        <View style={{ flexDirection: 'row' }}>
                            <Text medium px18 numberOfLines={1} flex1>{planObj.restaurant_name} </Text>
                            <TouchableOpacity onPress={() => navigation.push('Help',{orderId : planObj.id})}>
                                <Text boldSemi px16 primary style={{ marginStart: dimens.w2 }}>HELP</Text>
                            </TouchableOpacity>
                        </View>
                        <Text medium px14 black50>{planObj.subscription_name}, {constants.currency}{planObj.total_amount}</Text>
                    </View>
                </View>
                {/** Container */}
                <View style={[{ flex: 1, }, spacing.viewPadding]}>
                    {/** Tiffin Done */}
                    <View style={{ flex: 1, alignItems: 'center', paddingTop: dimens.h5 }}>
                        <ImageFast
                            style={{ width: dimens.w67, height: dimens.w67, }}
                            contain
                            source={images.orderPlaced} />
                    </View>
                    {/**Ratting Emoji */}


                    <View style={{ marginBottom: dimens.w3 }}>
                        <RatingBarSmile rating={rating} disabled={isRatingApplyed} OnRating={(rating) => { setRating(rating) }} />
                    </View>
                    <Text medium center size={fontSize.FONT_40Px} black50
                        style={{
                            fontFamily: font.BalooBhainaRegular, marginTop: dimens.h3
                            , marginBottom: isRatingApplyed ? dimens.h14 : 0
                        }}> {ratingText[rating - 1]}</Text>
                    {!isRatingApplyed ?
                        <View style={{ marginTop: dimens.h6, justifyContent: 'flex-end' }}>
                            <Button onPress={() => callApiRating()}
                                full style={{ paddingVertical: constants.btnPaddingVertical }} >
                                <Text transform='uppercase' boldSemi white >DONE</Text>
                            </Button>
                        </View> : null}
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    headerRoot: {
        flexDirection: 'row', alignItems: 'center',
        marginStart: constants.headerIconMarginStart,
        marginTop: constants.marginTopHeader
    },
});
