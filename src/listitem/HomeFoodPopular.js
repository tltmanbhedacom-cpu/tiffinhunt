import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View, FlatList, Platform, Alert } from 'react-native';
import { Loader, Button, Text, TextInputView, ImageIcon, ImageFast, ScalableImage } from '../component'
import { constants, images, colors, styleApp, dimens } from '../constants'
import { Colors } from 'react-native/Libraries/NewAppScreen';



var imageWidth = constants.screenWidth / 4;

class HomeFoodPopular extends Component {
    constructor(props) {
        super(props)
        // console.log(this.props.listData);
    }

    onRowClick = (index) => {
        this.props.onClick(index, index)
    }

    renderItem = ({ item, index }) => {
        return (
            <View style={[styles.containerData]}>
                <ImageFast
                    cover
                    style={styles.image}
                    url='https://food.fnr.sndimg.com/content/dam/images/food/fullset/2013/7/19/1/FNM_090113-50-Chicken-Dinners-Ratatouille-Recipe_s4x3.jpg.rend.hgtvcom.616.462.suffix/1377803652046.jpeg' />
                <Text boldSemi white px12 style={styles.discount}>10% OFF</Text>
                <View style={styles.mealRoot}>
                    <Text black medium px18>MealBox</Text>
                    <Text black50 medium px14>Italian,Chinese,indian</Text>
                    <View style={{ backgroundColor: colors.grayLight, width: '20%', height: 1, marginTop: dimens.h1 }}></View>
                    <View style={{ marginTop: dimens.w2, flexDirection: 'row' ,marginBottom : dimens.wo5}}>
                        <ImageFast style={{ width: dimens.w4, height: dimens.w4 }} source={images.starYellow} />
                        <Text black50 medium px12 style={{marginStart :dimens.w1}}>4J - 40-50 mins</Text>
                    </View>
                    <Text black50 medium px12>Free Delivery - £3.00 for two</Text>
                </View>
            </View>
        )
    }
    _keyExtractor = (item, index) => item + "";


    render() {
        return (
            <View>
                <FlatList
                    data={this.props.listData}
                    extraData={this.props}
                    renderItem={this.renderItem}
                    horizontal={false}
                    keyExtractor={this._keyExtractor}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    mealRoot :{
        justifyContent: 'center', flex: 1, flexDirection: 'column', 
        marginStart : dimens.w3
    },
    discount: {
        overflow: 'hidden',
        borderRadius: dimens.w1,
        position: 'absolute',
        marginTop: dimens.w4,
        paddingHorizontal: dimens.w3,
        paddingVertical: dimens.wo5,
        backgroundColor: colors.red,
        marginStart : dimens.w1
    },
    image: {
        width: imageWidth, height: imageWidth,
        overflow: 'hidden', borderRadius: constants.borderRadius
    },
    containerData: {
        flexDirection: 'row',
        borderRadius: constants.borderRadius,
        borderColor: colors.borderColor,
        marginVertical: dimens.h1,
        borderWidth: constants.borderWidth,
        paddingHorizontal: dimens.w2o5,
        paddingVertical: dimens.w2
    },
    menuNameStyle:
    {
        marginVertical: '0.5%',
        width: '100%',
        marginRight: 5
    },
    lblFreeDeliveryStyle:
    {
        marginVertical: '0.5%',
        width: '100%',
        marginLeft: dimens.w1
    }
})

export default HomeFoodPopular;