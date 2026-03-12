import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View, FlatList, Platform, Alert } from 'react-native';


import { Loader, Button,  TextInputView, ImageIcon, ImageFast, ScalableImage, Text } from '../component'
import { constants, images, colors, styleApp, dimens } from '../constants'


{/*  */ }

var imageWidth = constants.screenWidth * 0.55;

class FlexibalPlanList extends Component {
    constructor(props) {
        super(props)
        console.log(this.props.listData);
    }

    onRowClick = (index) => {
        this.props.onClick(index, index)
    }

    renderItem = ({ item, index }) => {
        return (
            <View style={[styles.containerData, { width: imageWidth }, styleApp.shadows,
            styleApp.shadowCorner]}>
                <ImageIcon
                    style={{ width: dimens.w10, height: dimens.w10, resizeMode : 'contain' }}
                    path={item.icon}
                />
                <View style={{flex:1,}}>
                <Text medium black px18 style={{ marginVertical: dimens.w3, }}>{item.title}</Text>
                <Text
                    numberOfLines={3} ellipsizeMode='tail'
                    style={{flex:1, }}
        black50 px12 medium>{item.text}</Text>
                </View>
   
            </View>

        )
    }
    _keyExtractor = (item, index) => item.id + "";


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
    containerData: {
        // flex: 1,
        backgroundColor: 'white',
        marginHorizontal: dimens.w2,
        marginTop: dimens.w1,
        marginBottom: dimens.w3,
        padding: dimens.w3
    },
})

export default FlexibalPlanList;