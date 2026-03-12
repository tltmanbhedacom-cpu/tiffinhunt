import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View, FlatList, Platform, Alert, TouchableOpacity } from 'react-native';


import { Loader, Button, Text, DividerH, ImageIcon, ImageFast, ScalableImage } from '../component'
import { constants, images, colors, styleApp, dimens, spacing } from '../constants'

var skipObj = {};
const moment = require('moment');
class TiffinPlanList extends Component {
    constructor(props) {
        super(props)
        console.log(this.props.listData);
    }

    /**
     *  1 =Re order
     *  2 = Skip /pause
     */
    onRowClick = (type, index, item) => {
        console.log(type)
        this.props.onClick(type, index, item)
    }

    renderItem = ({ item, index }) => {
        var skipDetails = item.skipmeals_details;
        if (skipDetails != null && skipDetails.length > 0) {
            skipObj = skipDetails[0]
        }
        return (
            <View style={[styles.containerData, spacing.viewPadding]}>
                {/** Name price */}
                <View style={{ flexDirection: 'row' }}>
                    <Text boldSemi px14 flex1>{item.restaurant_name}</Text>
                    <Text regular px14>{constants.currency}{item.total_amount}</Text>
                </View>
                {/** Address */}
                <View style={{ flexDirection: 'row' }}>
                    <Text medium px14 black50 flex1>{item.restaurant_location}</Text>
                    {!this.props.isFromPayment ?
                        <TouchableOpacity
                            disabled={parseInt(item.rate_count) > 0}
                            onPress={() => this.onRowClick(3, index, item)}>
                            {parseInt(item.rate_count) > 0 ?
                                <View style={{ flexDirection: 'row' }}>
                                    <Text regular px16 primary style={{marginEnd : dimens.w1}}>{item.rate_count}</Text>
                                    <ImageIcon path={images.starYellow} />
                                </View>
                                :
                                <Text boldSemi px16 primary>RATE</Text>
                            }
                        </TouchableOpacity>
                        : null}
                </View>
                <View style={{
                    backgroundColor: colors.divider,
                    height: 0.5, width: dimens.w11, marginVertical: dimens.w1o3
                }} />
                {/** Meal and Time */}
                <Text boldSemi px14 flex1>{item.subscription_name} </Text>
                {!this.props.isFromPayment ?
                    <Text regular px14 black50>{item.plan_start_date} - {item.plan_end_date}</Text> :
                    <Text medium px14 primary>Expires on {item.plan_end_date}</Text>}
                {item.skipmeals_details.length > 0 ?
                    <Text red regular px12 primary>You have skipped tiffin for {}
                        {moment(skipObj.skip_start_date).format('DD MMM')} -
                    {moment(skipObj.skip_end_date).format('DD MMM')},{' '}
                        {moment(skipObj.skip_end_date).format('YYYY')}</Text> : null
                }

                {/**BUttons */}
                {/** isFromPayment : used in tow screen this one and Payment in menu */}
                {!this.props.isFromPayment ?
                    <View style={{ flexDirection: 'row', marginTop: dimens.w2 }}>
                        {item.skipmeals_details.length <= 0 ? <View style={{ flexDirection: 'row', flex: 1 }}>
                            <Button onPress={() => this.onRowClick(1, index, item)}
                                style={{ flex: 1 }} outline outlineColor={colors.primary}>
                                <Text center boldSemi primary px14 >REORDER</Text>
                            </Button>
                            {/* //item.subscription_id == 1 */}
                            {(item.subscription_day == 14 || item.subscription_day == 28) ?
                                <Button onPress={() => this.onRowClick(2, index, item)}
                                    style={{ flex: 1, marginStart: dimens.w4 }} outline outlineColor={colors.primary}>
                                    <Text center boldSemi primary px14 >SKIP/PAUSE</Text>
                                </Button> : null}
                        </View> : null}

                    </View> : <Button full>
                        <Text center boldSemi primary px14 white >REORDER</Text>
                    </Button>
                }

            </View>
        )
    }

    renderSeparator = () => {
        return (<DividerH style={{ marginHorizontal: dimens.w7, flex: 1, marginTop: -dimens.w1 }} />)
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
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={this.renderSeparator}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    containerData: {
        flex: 1,
    },
})

export default TiffinPlanList;