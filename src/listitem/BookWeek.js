import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, View, FlatList, Platform, Alert } from 'react-native';


import { Loader, Button, Text, TextInputView, ImageIcon, ImageFast, ScalableImage } from '../component'
import { constants, images, colors, styleApp, dimens } from '../constants'


var itemWidth = constants.screenWidth * 0.14 + dimens.w1;
var itemHeight = itemWidth * 1.5
var weekDay = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT','SUN']
var keySat ='SAT'
var keySun = 'SUN'
var todayDay;
const moment = require('moment');
var isTodayDay=false;
class BookWeek extends Component {
    constructor(props) {
        super(props)
        
        console.log('BookWeek ',this.props.listData);
        todayDay =moment().format('DD');
        console.log('tody ',todayDay)
    }

    onRowClick = (index, item) => {
        this.props.onClick(index, item)
    }

    renderItem = ({ item, index }) => {
        // var dayDate =moment().add(index+1,'days').format('E DD');
        // console.log(' dayDate ',dayDate)
        // isTodayDay = todayDay == dayDate.split(' ')[1]
        // var todayName = dayDate.split(' ')[0]
        return (
            // <TouchableOpacity 
            // style={{backgroundColor:'red'}}
            // disabled={(todayName == keySat || todayName ==keySun)}
            // onPress={() => this.onRowClick(index)}
            //     style={[styles.commonContainer,
            //         isTodayDay ? styles.containerData : styles.containerDataBorder]}>
            //     <Text color={isTodayDay ? colors.white : colors.fontPrimary} medium px12>
            //         {weekDay[dayDate.split(' ')[0]]}</Text>
            //     <Text color={isTodayDay ? colors.white : colors.fontPrimary} medium px18>
            //         {dayDate.split(' ')[1]}
            //     </Text>
            // </TouchableOpacity>
            <TouchableOpacity 
            onPress={() => this.onRowClick(index, item)}
                style={[styles.commonContainer,
                    item.isSelected ? styles.containerData : styles.containerDataBorder]}>
                <Text color={item.isSelected ? colors.white : colors.fontPrimary} medium px12>{item.date}</Text>
                <Text color={item.isSelected ? colors.white : colors.fontPrimary} medium px18>{item.day}</Text>
            </TouchableOpacity>
        )
    }
    _keyExtractor = (item, index) => item + "";

    render() {
        return (
            <View>
                <FlatList
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
    commonContainer: {
        width: itemWidth,
        height: itemHeight,
        justifyContent: 'center',
        marginVertical: dimens.w3, marginHorizontal: dimens.w1o2,
        alignItems: 'center', paddingVertical: dimens.w4, paddingHorizontal: dimens.w3,
        borderRadius: dimens.w10,
        borderColor: colors.primary,

    },
    containerData: {
        backgroundColor: colors.primary,

    },
    containerDataBorder: {
        backgroundColor: 'transparent',
        borderWidth: 0.5
    },
})

export default BookWeek;