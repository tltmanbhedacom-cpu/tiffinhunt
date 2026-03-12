import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View, FlatList, Platform, Alert } from 'react-native';


import { Loader, Button, Text, TextInputView, ImageIcon, ImageFast, ScalableImage } from '../component'
import { constants, images, colors, styleApp, dimens } from '../constants'


{/* */ }

class SelectPlan extends Component {
    constructor(props) {
        super(props)
        console.log(this.props.listData);
    }

    renderItem = ({ item, index }) => {
        return (
            <View style={[styles.containerData, styleApp.shadows,styleApp.shadowCorner]}>
                <View style={{ flexDirection: 'column', flex: 1 }}>
                    <Text black50 medium px12>{item.subscription_days} DAY</Text>
        <Text boldSemi px20 black style={{marginVertical :dimens.wo5}}>
        {constants.currency}{item.subscription_price}/day</Text>
                    {item.is_recommended ==1 ? <Text center px12 medium white style={styles.bestValue}>BEST VALUE</Text> : <View/>}
                    
                </View>
                <Button style={styles.chooseBtn}
                    onPress={() => this.props.onClick(item)}>
                    <Text white bold >CHOOSE</Text>
                </Button>
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
                    keyExtractor={this._keyExtractor}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    containerData: {
        marginVertical: dimens.w3,
        marginHorizontal: dimens.w1,
        flexDirection: 'row',
        alignItems:'center',
        paddingHorizontal : dimens.w4,
        paddingVertical : dimens.w3
    }, 
    chooseBtn:{
        paddingVertical: dimens.w3,
    },
    bestValue :{
        width :dimens.w25,
        backgroundColor :colors.red,
        paddingHorizontal : dimens.w2,
        paddingVertical : dimens.w1,
        borderRadius : constants.borderRadius,
        overflow: 'hidden'
    }
})

export default SelectPlan;