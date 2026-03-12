import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View, FlatList, SectionList, Alert } from 'react-native';
import MealDetailItem from './MealDetailItem'

import { Loader, Button, Text, TextInputView, ImageIcon, ImageFast, ScalableImage } from '../component'
import { constants, images, colors, styleApp, dimens } from '../constants'

class MenuDetailList extends Component {
    constructor(props) {
        super(props)
        console.log('MenuDetailList ',this.props.listData);
    }

    /**
     * Type 
     *  1 = Show Details
     *  2 = Favorite 
     *  
     */
    onRowClick = (index, item, type) => {
        this.props.onClick(index, item, type)
    }

    renderHeader = ({ section }) => {
        return (
            <Text black bold px20 flex1 style={{ marginVertical: dimens.w2, }}>{section.title}</Text>
        )
    }
    renderItem = ({ item, index }) => {
        return (<MealDetailItem item={item} index={index} isFromCart={false}
            onClick ={this.onRowClick}/>)
    }
    _keyExtractor = (item, index) => item.favourite_id + item.id + "";

    renderFooter = () => {
        return (<View style={styleApp.listFooterPadding}/>);
    };

    render() {
        return (
            <View>
                <SectionList
                    sections={this.props.listData}
                    keyExtractor={this._keyExtractor}
                    extraData={this.props}
                    renderItem={this.renderItem}
                    showsVerticalScrollIndicator={false}
                    stickySectionHeadersEnabled={false} // for handle sticky section headers
                    ListFooterComponent={this.renderFooter}
                    renderSectionHeader={this.renderHeader} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    iconText: {
        padding: dimens.w1, marginTop: dimens.w1
    },
    titleRoot: {
        flexDirection: 'row', marginTop: dimens.h2, alignItems: 'center',
        marginBottom: dimens.wo5
    },
    containerData: {
        flex: 1,
        flexDirection: 'column',
        marginBottom: dimens.h1,
    },
    menuImage:
    {
        width: "100%",
        height: constants.screenWidth / 2.5,
        overflow: 'hidden', borderRadius: constants.borderRadius
    }, txtMenuName:
    {
        flex: 1,
        color: colors.black,
        marginLeft: dimens.w2,
    },

})

export default MenuDetailList;