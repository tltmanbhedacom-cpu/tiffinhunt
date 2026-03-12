import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View, FlatList, TouchableOpacity, Alert } from 'react-native';


import { Loader, Button, Text, TextInputView, ImageIcon, ImageFast, ScalableImage } from '../component'
import { constants, images, colors, styleApp, dimens, spacing } from '../constants'


{/* <HomeFood
ref="child"
listData={this.state.settingData}
onClick={this.onRowSettingClick} /> */}

class AddressList extends Component {
    constructor(props) {
        super(props)
        console.log(this.props.listData);
    }

    /**
     *  1 = Delete
     *  2 = select
     *  3 = Edit
     */
    onRowClick = (type, item) => {
        this.props.onClick(type, item)
    }

    renderItem = ({ item, index }) => {
        console.log('I ', index);
        return (
            <View style={[styles.containerData, spacing.viewMarginHorizontal]}>
                <View style={{ flexDirection: 'row' }}>
                    <ImageIcon path={item.address_type == 1 ? images.addAddressHome : images.work} />
                    {/** Address */}
                    <View style={styles.lblAddAddress}>
                        <Text px14 boldSemi black>{item.address_type == 1 ? "Home" : "Work"}</Text>
                        <Text black50 medium px14 style={{ marginTop: dimens.w2, marginEnd: dimens.w3 }}>
                            {item.house_no} {item.landmark}, {item.city_name} {item.pincode}</Text>
                        {/** Edit Delete */}

                        <View style={{ marginTop: dimens.w2, flexDirection: 'row' }}>
                            {!this.props.isSelect ?
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity onPress={() => this.onRowClick(3, item)}>
                                        <Text boldSemi primary px16 >EDIT</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ marginStart: dimens.w8 }}
                                        onPress={() => this.onRowClick(1, item.id)}>
                                        <Text boldSemi primary px16 >DELETE</Text>
                                    </TouchableOpacity>
                                </View> : <TouchableOpacity onPress={() => this.onRowClick(2, item)}>
                                    <Text boldSemi primary px16 >SELECT</Text>
                                </TouchableOpacity>}
                        </View>
                    </View>
                </View>
                <View style={{
                    backgroundColor: colors.divider, width: '100%', height: 0.5,
                    marginTop: dimens.w5, marginStart: dimens.w3
                    , marginBottom: dimens.w4
                }} />
            </View>
        )
    }
    _keyExtractor = (item, index) => item.id.toString();

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
        flex: 1,
    },
    lblAddAddress:
    {
        paddingHorizontal: dimens.w1,
        marginTop: dimens.wo5,
        marginStart: dimens.w1
    },
})

export default AddressList;