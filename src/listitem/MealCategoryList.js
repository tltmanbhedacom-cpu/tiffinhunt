import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View, FlatList, TouchableOpacity, Alert } from 'react-native';


import { Loader, Button, Text, TextInputView, ImageIcon, ImageFast, DividerH } from '../component'
import { constants, images, colors, styleApp, dimens } from '../constants'

{/* <HomeFood
ref="child"
listData={this.state.settingData}
onClick={this.onRowSettingClick} /> */}

class MealCategoryList extends Component {
    constructor(props) {
        super(props)
        console.log(this.props.listData);
    }

    onRowClick = (index) => {
        this.props.onClick(index, index)
    }

    renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => this.props.onClick(index)}
                style={[styles.containerData]}>
                <Text medium px16 black >{item.category_name}</Text>
            </TouchableOpacity>

        )
    }
    renderSeparator = () => {
        return (<DividerH />)
    }

    _keyExtractor = (item, index) => item.id + "";


    render() {
        return (
            <View>
                <FlatList
                    data={this.props.listData}
                    extraData={this.props}
                    renderItem={this.renderItem}
                    keyExtractor={this._keyExtractor}
                    ItemSeparatorComponent={this.renderSeparator}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    containerData: {
        flex: 1,
        paddingVertical: dimens.h2,
    },
})

export default MealCategoryList;