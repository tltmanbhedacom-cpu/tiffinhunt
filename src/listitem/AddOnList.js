import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, View, FlatList, SectionList, Alert } from 'react-native';
import MealDetailItem from './MealDetailItem'

import { Loader, Button, Text, TextInputView, ImageIcon, ImageFast, DividerH } from '../component'
import { constants, images, colors, styleApp, dimens } from '../constants'



class AddOnList extends Component {
    constructor(props) {
        super(props)
        console.log('selectedPlanselectedPlan ',this.props.selectedPlan);
    }

    /**
     * Type 
     *  1 = Select / Unselect
     *  
     */
    onRowClick = (index, item, type) => {
        this.props.onClick(index, item, type)
    }

    renderHeader = ({ section }) => {
        const index = this.props.listData.indexOf(section)
        return (<View >
            {index != 0 ? this.renderSeparator() : null}

            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: dimens.h1_3 }}>
                <ImageIcon
                    style={{ width: dimens.w4, height: dimens.w4 }}
                    path={images.addon} />
                <Text medium px18 style={{ marginStart: dimens.w2 }}>{section.title}</Text>
            </View>

        </View>)
    }
    renderItem = ({ item, index }) => {
        return (<TouchableOpacity onPress={() => this.onRowClick(index, item, 1)}
            style={{ flexDirection: 'row', alignItems: 'center', marginVertical: dimens.w1o3 }}>
            <ImageIcon
                path={item.isSelected ? images.radio : images.radioblank} />
            <Text medium black50 px14 style={{ marginStart: dimens.w2 }}>{item.addon_text} - 
            {constants.currency}{item.addon_price} x {this.props.selectedPlan.subscription_days}</Text>
        </TouchableOpacity>)
    }
    _keyExtractor = (item, index) => item.id+''+item.addon_id;

    renderSeparator = () => {
        return (<DividerH style={{ width: dimens.w45, flex: 1, marginVertical: dimens.w2 }} />)
    }

    renderFooter = () => {
        return (<View style={styleApp.listFooterPadding} />);
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

export default AddOnList;