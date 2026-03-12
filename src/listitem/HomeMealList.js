import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View, FlatList, TouchableOpacity, Alert } from 'react-native';


import { Loader, Button, Text, TextInputView, ImageIcon, ImageFast, ScalableImage } from '../component'
import { constants, images, colors, styleApp, dimens } from '../constants'
import HomeFoodItalian from '../listitem/HomeFoodItalian'
import HomeFood from '../listitem/HomeFood'

{/* <HomeFood
listData={settingData}
onClick={onRowSettingClick} /> */}

class HomeListTest extends Component {
    constructor(props) {
        super(props)
    }

    // Type 1 = View All
    // 2 =View Meal detail
    onRowClick = (type, index, item) => {
        this.props.onClick(type, index, item)
    }

    TitleViewHeader = (item) => {
        return (
            <View style={styles.headerStyle}>
                <Text black px20 boldSemi flex1>{item.title}</Text>
                <TouchableOpacity
                    style={{ borderRadius: dimens.w2, backgroundColor: colors.bgGray }}
                    onPress={() => this.onRowClick(1, 0, item)}>
                    <Text medium px14 gray style={styles.lblViewAllStyle}>View all</Text>
                </TouchableOpacity>
            </View>
        )
    }


    setRowList = (item, index) => {
        if (index % 2 == 0) {
            return (
                <HomeFoodItalian
                    listData={item.data}
                    onClick={this.onRowClick}
                />
            )
        } else {
            return (
                <HomeFood
                    listData={item.data}
                    onClick={this.onRowClick}
                />
            )

        }
    }

    renderItem = ({ item, index }) => {

        return (
            <View style={[styles.containerData,{}]}>
                {this.TitleViewHeader(item)}
                {this.setRowList(item, index)}

            </View>

        )
    }
    _keyExtractor = (item, index) => item.id + "";


    render() {
        return (
            <View style={{flex: 1}}>
                <FlatList
                    data={this.props.listData}
                    extraData={this.props}
                    renderItem={this.renderItem}
                    keyExtractor={this._keyExtractor}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={this.props.ListHeaderComponent}
                    ListFooterComponent={this.props.ListFooterComponent}
                    contentContainerStyle={this.props.contentContainerStyle}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    containerData: {
        flex: 1,
    }, headerStyle: {
        flexDirection: 'row', marginTop: dimens.h3, alignItems: 'center',
        marginBottom: dimens.h1
    }, lblViewAllStyle: {
        paddingHorizontal: dimens.w4,
        paddingVertical: dimens.w1
    },
})

export default HomeListTest;
