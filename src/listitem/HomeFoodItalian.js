import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, View, FlatList, Platform, Alert } from 'react-native';
import { Loader, Button, Text, TextInputView, ImageIcon, ImageFast, ScalableImage } from '../component'
import { constants, images, colors, styleApp, dimens } from '../constants'


var imageWidth = constants.screenWidth / 4;

class HomeFoodItalian extends Component {
    constructor(props) {
        super(props)
        // console.log(this.props.listData);
    }

    onRowClick = (type, index, item) => {
        this.props.onClick(type, index, item)
    }

    renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity 
            onPress={()=>this.onRowClick(2,index,item)}
            style={[styles.containerData]}>
                <ImageFast
                    cover
                    style={styles.image}
                    url={item.subcategory_image} />

                <View style={{ marginStart: dimens.w2 }}>
                    <Text px18 black medium>{item.subcategory_name}</Text>
                    <Text px14 black50 medium>{item.subcategory_tagline}</Text>
                    <View style={styles.divider} />
                    <View style={{ flexDirection: 'row', marginTop: dimens.h2 }}>
                        <Text px18 black regular>From </Text>
                        <Text px18 black boldSemi>{constants.currency}{item.start_from_price}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    _keyExtractor = (item, index) => item.id + item.category_id;


    render() {
        return (
            <View>
                <FlatList
                    data={this.props.listData}
                    extraData={this.props}
                    renderItem={this.renderItem}
                    horizontal={true}
                    keyExtractor={this._keyExtractor}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    divider: {
        width: dimens.w15, height: dimens.wo5, backgroundColor: colors.borderColor
        , marginTop: dimens.w2
    },
    containerData: {
        flexDirection: 'row',
        borderRadius: constants.borderRadius,
        borderColor: colors.borderColor,
        marginEnd: dimens.w4,
        borderWidth: constants.borderWidth,
        paddingHorizontal: dimens.w2o5,
        paddingVertical: dimens.w2
    },
    discount: {
        overflow: 'hidden',
        borderRadius: dimens.w1,
        end: 0,
        position: 'absolute',
        margin: dimens.w5,
        paddingHorizontal: dimens.w3,
        paddingVertical: dimens.w1,
        backgroundColor: colors.red
    },
    image: {
        width: imageWidth, height: imageWidth,
        overflow: 'hidden', borderRadius: constants.borderRadius
    }
})

export default HomeFoodItalian;