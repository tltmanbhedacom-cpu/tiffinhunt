import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View, FlatList, Platform, Alert } from 'react-native';


import { Loader, Button, Text, TextInputView, ImageIcon, ImageFast, ScalableImage } from '../component'
import { constants, images, colors, styleApp, dimens } from '../constants'


{/* <HomeFood
listData={settingData}
onClick={onRowSettingClick} /> */}

class HomeFood extends Component {
    constructor(props) {
        super(props)
        console.log(this.props.listData);
    }

    onRowClick = (index) => {
        this.props.onClick(index, index)
    }

    renderItem = ({ item, index }) => {
        return (
            <View style={[styles.containerData]}>
    <Text style={{ marginVertical: '0.5%',  width : '100%' }}>Row Item { index }</Text>
            </View>

        )
    }
    _keyExtractor = (item, index) => item+"";

  
    renderSeparator = () => {
        return (<DividerH style={{ marginHorizontal: dimens.w7, flex: 1, marginTop: -dimens.w1 }} />)
    }
    render() {
        return (
            <View>
                <FlatList
                    data={this.props.listData}
                    extraData={this.props}
                    renderItem={this.renderItem}
                    keyExtractor={this._keyExtractor}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={this.renderSeparator}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    containerData: {
        flex :1,
        backgroundColor :'pink',
    },
})

export default DefaultList;