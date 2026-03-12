import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, View, FlatList, Platform, Alert } from 'react-native';


import { Loader, Button, Text, TextInputView, ImageIcon, ImageFast, ScalableImage } from '../component'
import { constants, images, colors, styleApp, dimens } from '../constants'


let slotWidth = constants.screenWidth / 2.3;
let slotHeight = slotWidth * 0.26
class SlotList extends Component {
    constructor(props) {
        super(props)
    }

    onRowClick = (index, item) => {
        this.props.onClick(index, item)
    }

    renderItem = ({ item, index }) => {
        return (
            <View style={{ flex: 1 }}>
                <TouchableOpacity
                    style={{ alignItems: index % 2 == 0 ? 'flex-start' : "flex-end" }}
                    onPress={() => this.onRowClick(index, item)}>
                    <Text medium px18 style={[styles.slotCommon,
                    item.isSelected ? styles.slotSelected : styles.slotUnSelect]}>{item.time_slot}</Text></TouchableOpacity>
            </View>
        )
    }
    _keyExtractor = (item, index) => item.id + "";


    render() {
        return (
            <FlatList
                data={this.props.listData}
                extraData={this.props}
                numColumns={2}
                renderItem={this.renderItem}
                keyExtractor={this._keyExtractor}
                showsVerticalScrollIndicator={false}
            />
        )
    }
}

const styles = StyleSheet.create({
    containerData: {
        flex: 1,
    },
    slotCommon: {
        width: slotWidth,
        height: slotHeight,
        textAlign: 'center',
        textAlignVertical: 'center',
        overflow: 'hidden',
        paddingTop: constants.isAndroid ? 0 : dimens.w2o5,
        borderRadius: constants.borderRadius,
        marginTop: dimens.w2
    },
    slotSelected: {
        backgroundColor: colors.primary,
        color: 'white',

    },
    slotUnSelect: {
        backgroundColor: colors.white,
        color: colors.primary,
        borderColor: colors.primary,
        borderWidth: 0.8,
    },
})

export default SlotList;