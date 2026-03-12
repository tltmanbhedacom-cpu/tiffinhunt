import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View, FlatList, TouchableOpacity, Alert } from 'react-native';


import { Loader, Button, Text, TextInputView, ImageIcon, ImageFast, ScalableImage } from '../component'
import { constants, images, colors, styleApp, dimens } from '../constants'

  /**
     * Type 
     *  1 = Show Details
     *  2 = Favorite 
     *  
     */

export default MealDetailItem = ({ item, index ,onClick ,isFromCart }) => {
    return (
        <View style={styles.containerData}>
            <TouchableOpacity onPress={() => onClick(index, item, 1)}>
                <ImageFast
                    cover
                    style={styles.menuImage}
                    url={item.restaurant_image} />
            </TouchableOpacity>

            <View style={styles.titleRoot}>
                <ImageIcon path={item.is_type == 1 ? images.vegGreen : images.nonVeg} />
                <Text black medium px18 flex1 style={{ marginHorizontal: dimens.w1 }}>{item.restaurant_name}</Text>
                {/** Favorite Icon */}
                {!isFromCart ?
                <ImageIcon
                onClick={() => onClick(index, item, 2)}
                path={item.favourite_id <= 0 ? images.favourite : images.favoritesRed} /> :null}
            </View>
            <Text medium black50 px12>  {constants.bullet} {item.user_name}   {constants.bullet} {item.address}</Text>
            {/** Price & Ratting */}
            <View style={{
                alignItems: 'center', flexDirection: 'row', marginTop: dimens.w1
            }}>
                <ImageIcon path={images.prices} />
                <Text primary medium px14 style={[styles.iconText,{marginEnd : dimens.w5}]}>
                    Starting From {constants.currency}{item.start_from_price}</Text>
                <ImageIcon
                    path={images.starYellow} />
                <Text black50 medium px14 style={styles.iconText}>{item.avg_rating} Ratings {constants.bullet} {item.user_count_rating}+</Text>
            </View>
            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                <ImageIcon path={images.time} />
                <Text black50 medium px14 style={styles.iconText}>{constants.bullet} 
                {item.restaurant_subscription_name.join(" "+constants.bullet)}</Text>
            </View>
            {item.offer > 0 ?
                <TouchableOpacity onPress={() => this.onClick(index, item, 1)}>
                    <Text
                        medium px14
                        color={colors.fontGreen} style={styleApp.offer}>OFFER {constants.bullet} {item.offer}% OFF ON ALL DISHES</Text>
                </TouchableOpacity> : null}

            <View style={{
                backgroundColor: colors.divider, width: '100%', height: 0.5, marginTop: dimens.w5
            }} />
        </View>
    )
}
const styles = StyleSheet.create({
    iconText: {
        padding: dimens.w1, marginTop: dimens.w1
    },
    titleRoot: {
        flexDirection: 'row', marginTop: dimens.h2, alignItems: 'center',
        marginBottom: dimens.wo5
    },
    containerData: {
        flex: 1,
        flexDirection: 'column',
        marginBottom: dimens.h1,
    },
    menuImage:
    {
        width: "100%",
        height: constants.screenWidth / 2.5,
        overflow: 'hidden', borderRadius: constants.borderRadius
    }, txtMenuName:
    {
        flex: 1,
        color: colors.black,
        marginLeft: dimens.w2,
    },

})