import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View, FlatList, Platform, Alert } from 'react-native';


import { Loader, Button, Text, TextInputView, ImageIcon, ImageFast, ScalableImage } from '../component'
import { constants, images, colors, styleApp, dimens } from '../constants'


{/*  */ }

var imageWidth = constants.screenWidth * 0.65;
var imageHeight = imageWidth / 1.7
var weekDay = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT','SUN']

const moment = require('moment');
class MealDishWeekList extends Component {
    constructor(props) {
        super(props)
        console.log(this.props.listData);
    }

    onRowClick = (index) => {
        this.props.onClick(index, index)
    }

    scrollToIndex = (scrollIndex) => {
        this.flatListRef.scrollToIndex({ animated: true, index: scrollIndex });
    }

    renderItem = ({ item, index }) => {
        // var dayDate =moment().add(index+1,'days').format('E DD');
        // return (
        //     <View style={[styles.containerData, { width: imageWidth }]}>
        //         <ImageFast cover style={styles.image} url={item.dish_image} />
        //         <View style={{ marginVertical: dimens.w2, paddingHorizontal: dimens.w2, }}>
        // <Text black50 px12 medium> {item.dish_day ==1 ? 'TODAY ' : item.dish_day ==2 ?'TOMORROW ' :''}
        // {dayDate.split(' ')[1]} {weekDay[dayDate.split(' ')[0]]}</Text>
        //             <View style={{ flexDirection: 'row', marginVertical: dimens.w1 }}>
        //                 <ImageIcon path={images.vegGreen} />
        //                 <Text flex1 numberOfLines={3} ellipsizeMode='tail'
        //                     black medium px16 style={{ paddingHorizontal: dimens.w1, marginStart: dimens.wo5 }} >
        //                     {item.dish_desc}</Text>
        //             </View>
        //         </View>
        //     </View>

        return (
            <View style={[styles.containerData, { width: imageWidth }]}>
                <ImageFast cover style={styles.image} url={item.dish_image} />
                <View style={{ marginVertical: dimens.w2, paddingHorizontal: dimens.w2, }}>
        <Text black50 px12 medium>{item.date} {item.day}, {item.month}</Text>
                    <View style={{ flexDirection: 'row', marginVertical: dimens.w1 }}>
                        {/* <ImageIcon path={images.vegGreen} /> */}
                        <Text flex1 numberOfLines={3} ellipsizeMode='tail'
                            black medium px16 style={{ paddingHorizontal: 0 }} >
                            {item.dish_desc}</Text>
                    </View>
                </View>
            </View>
        )
    }
    _keyExtractor = (item, index) => item.id + "";


    render() {
        return (
            <View>
                <FlatList
                    ref={(ref) => { this.flatListRef = ref; }}
                    horizontal={true}
                    data={this.props.listData}
                    extraData={this.props}
                    renderItem={this.renderItem}
                    keyExtractor={this._keyExtractor}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    containerData: {
        backgroundColor: colors.bgGray, marginHorizontal: dimens.w2, borderRadius: constants.borderRadius
    },
    image: {
        width: imageWidth, height: imageHeight,
        overflow: 'hidden', borderTopLeftRadius: constants.borderRadius,
        borderTopRightRadius: constants.borderRadius
    }
})

export default MealDishWeekList;