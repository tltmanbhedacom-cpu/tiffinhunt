import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Image, View, FlatList, Platform, Alert } from 'react-native';
import { Loader, Button, Text, TextInputView, ImageIcon, ImageFast, ScalableImage } from '../component'
import { constants, images, colors, styleApp, dimens } from '../constants'
import { Colors } from 'react-native/Libraries/NewAppScreen';


{/* <HomeFood
ref="child"
listData={this.state.settingData}
onClick={this.onRowSettingClick} /> */}

var imageWidth = constants.screenWidth / 2;
var imageHeight = imageWidth / 1.7

class HomeFood extends Component {
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
                <Text boldSemi white px12 style={styles.discount}>10% OFF</Text>
                <Text px18 black medium style={{ marginTop: dimens.h1 }}>{item.subcategory_name}</Text>
                <Text px14 black50 medium>{item.subcategory_tagline}</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Text px18 black regular>Starting from </Text>
                    <Text px18 black boldSemi>{constants.currency}{item.start_from_price}</Text>
                </View>
            </TouchableOpacity>)}
            
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
    containerData: {
        flexDirection: 'column',
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
        margin: dimens.w4,
        paddingHorizontal: dimens.w3,
        paddingVertical: dimens.wo5,
        backgroundColor: colors.red
    },
    image: {
        width: imageWidth, height: imageHeight,
        overflow: 'hidden', borderRadius: constants.borderRadius
    }
})

export default HomeFood;