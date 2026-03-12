import React, { Component } from 'react';
import { StyleSheet, View, FlatList, SectionList, Alert } from 'react-native';
import MealDetailItem from './MealDetailItem'

import { Loader, Button, Text, TextInputView, ImageIcon, ImageFast, ScalableImage } from '../component'

class FavoriteList extends Component {
    constructor(props) {
        super(props)
        console.log("favourite list data : ",this.props.listData);
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

    
    renderItem = ({ item, index }) => {
        return (<MealDetailItem item={item} index={index}
            onClick ={this.onRowClick}/>)
    }
    _keyExtractor = (item, index) => item.favourite_id + item.id + "";

    renderFooter = () => {
        return (<View style={styleApp.listFooterPadding}/>);
    };

    render() {
        return (
            <View>
                <FlatList
                    data={this.props.listData}
                    keyExtractor={this._keyExtractor}
                    extraData={this.props}
                    renderItem={this.renderItem}
                    showsVerticalScrollIndicator={false}
                 />
            </View>
        )
    }
}
export default FavoriteList;