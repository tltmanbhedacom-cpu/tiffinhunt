import React, { useEffect, useState, useRef } from "react";
import { TouchableOpacity, Dimensions, SafeAreaView, StyleSheet, Image, View, FlatList, Platform, Alert } from 'react-native';
import { Loader, Button, Text, TextInputView, ImageIcon, ImageFast, Header } from '../component'
import { constants, images, colors, styleApp, dimens, spacing } from '../constants'
import DatePicker from 'react-native-datepicker'

import { apiSkipMealplan } from '../redux/api'
import { useDispatch, useSelector } from 'react-redux';
import { getViewOrderS } from "../redux/reducers/AppReducer";
// import { getViewOrderS, } from '../redux/actions/ActionCB'
let slotWidth = constants.screenWidth / 2.3;
let slotHeight = slotWidth * 0.26

var isStartDate = true;
var payment = {};
var formatD_3_Y = "DD MMM YYYY"
var Y_M_D = 'YYYY-MM-DD'
function SkipPauseMeal({ route, navigation }) {
    const dispatch = useDispatch();
    const [isFetching, setIsFetching] = useState(false);
    const [slotPosition, setSlotPosition] = useState(1)
    const [isSatSun, setIsSatSun] = useState(true)
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [isShowSaveButton, setIsShowSaveButton] = useState(false)

    const dataReducer = useSelector((state) => state.AppReducer);
    const { viewOrders } = dataReducer;

    const dateRef = useRef();
    const moment = require('moment');

    useEffect(() => {
        payment = route.params.item;
        console.log('paymentpayment ', payment)
        if (payment != null && payment.skipmeals_details.length <= 0) {
            setIsShowSaveButton(true)
        }
        setIsSatSun(payment.is_weekend == 1)
        return () => {
            payment = {}
        }
    }, []);

    function callSkipPause() {
        var param = {}
        param["order_id"] = payment.id
        param["is_weekend"] = isSatSun
        param["meal_day"] = slotPosition
        param["is_type"] = slotPosition > 0 ? 1 : 0


        // const param = new FormData();
        // param.append('order_id', payment.id);
        // param.append('is_weekend', isSatSun);
        // param.append('meal_day', slotPosition);
        // param.append('is_type', slotPosition > 0 ? 1 : 0)//1=Skip, 0=Pause
        var reqStartDate = ''
        var reqEndDate = ''
        if (slotPosition == 0) {
            if (startDate.length <= 0) {
                alert('Please select start date.')
                return;
            } else if (endDate.length <= 0) {
                alert('Please select end date.')
                return;
            }
            var iValid = moment(startDate, formatD_3_Y).isAfter(moment(endDate, formatD_3_Y));
            if (iValid) {
                alert('Please select valid Start date and End date.')
                return
            }
            var start = moment(startDate, formatD_3_Y);
            var end = moment(endDate, formatD_3_Y);

            //Difference in number of days
            var differenceDay = moment.duration(end.diff(start)).asDays() + 1;
            if (differenceDay > 7) {
                alert('You can skip meal max 7 days.');
                return;
            }
        param["skip_start_date"] = startDate
        param["skip_end_date"] = endDate

            // param.append('skip_start_date', startDate);
            // param.append('skip_end_date', endDate);
            reqStartDate = start.format(Y_M_D)
            reqEndDate = end.format(Y_M_D)
        } else {
            var a = moment(payment.plan_start_date, formatD_3_Y)
            var b = moment(payment.plan_start_date, formatD_3_Y)
            if (slotPosition == 2) {
                b = b.add(1, 'day')
            }
            param["skip_start_date"] = a.format(formatD_3_Y)
            param["skip_end_date"] = b.format(formatD_3_Y)

            // param.append('skip_start_date', a.format(formatD_3_Y));
            // param.append('skip_end_date', b.format(formatD_3_Y));
            reqStartDate = a.format(Y_M_D)
            reqEndDate = b.format(Y_M_D)
        }
        setIsFetching(true)
        apiSkipMealplan(param)
            .then(res => {
                var tempOrder = [...viewOrders]
                for (const item of tempOrder) {
                    if (item.id == payment.id) {
                        var obj = {
                            skip_end_date: reqEndDate,
                            skip_start_date:reqStartDate ,
                        }
                        item.skipmeals_details.push(obj)
                        break;
                    }
                }
                dispatch(getViewOrderS(tempOrder))
                navigation.goBack();
            })
            .catch(error => alert(error))
            .finally(() => { setIsFetching(false) });
    }

    function resetDates() {
        {
            setStartDate('')
            setEndDate('')
        }
    }
    function setDurationDate() {
        var addDays = 0;
        if (parseInt(slotPosition) > 0) {
            addDays = parseInt(slotPosition) == 1 ? 1 : 2
        } else {
            addDays = 0
        }
        return (<Text regular px18 black50 flex1>{moment(payment.plan_start_date, formatD_3_Y).format(formatD_3_Y)} -
            {moment(payment.plan_end_date, formatD_3_Y).add(addDays, 'days')
                .format(formatD_3_Y)}</Text>)
    }

    return (
        <SafeAreaView style={styleApp.safeAreaRoot}>
            <DatePicker
                ref={dateRef}
                style={{ width: 0, height: 0 }}
                mode="date"
                placeholder="select date"
                format="DD MMM YYYY"
                minDate={moment().add(2, 'days').format(formatD_3_Y)}
                confirmBtnText="Done"
                cancelBtnText="Cancel"
                customStyles={{
                    btnTextConfirm: {
                        color: colors.primary
                    }
                }}
                onDateChange={(date) => {
                    setSlotPosition(0)
                    if (isStartDate) {
                        setStartDate(date)
                    } else setEndDate(date)
                }}
            />
            <View style={styleApp.container}>
                <Loader loading={isFetching} />
                <Header icon={images.cancel} title="Skip or Pause Meal" />
                <View style={[styleApp.container, spacing.viewPaddingHorizontal,]}>
                    {/** Plan Details */}
                    <View style={[styleApp.shadows, spacing.viewPadding, styles.mealDetailInnerRoot]}>
                        <Text boldSemi px18>{payment.subscription_name} </Text>
                        <Text regular px18 black50 style={{ marginTop: dimens.w2 }}>{setDurationDate()}</Text>
                        <Text red px12 regular>You can only skip/pause your meal at once only.</Text>
                    </View>
                    {/** 1-2 day*/}
                    <View>
                        <ImageIcon style={styles.skipIcon} path={images.skipMeal} />
                        <Text medium px18>Skip your meal</Text>
                        {/** Days */}
                        <View style={{
                            flexDirection: 'row', justifyContent: 'space-between',
                            marginTop: dimens.w2,
                        }}>
                            <TouchableOpacity onPress={() => { setSlotPosition(1); resetDates(); }}>
                                <Text medium px18 style={[styles.slotCommon,
                                slotPosition == 1 ? styles.slotSelected : styles.slotUnSelect]}>1 Day</Text></TouchableOpacity>
                            <TouchableOpacity
                                style={{ marginStart: dimens.w3 }}
                                onPress={() => { setSlotPosition(2); resetDates(); }}>
                                <Text medium px18 style={[styles.slotCommon,
                                slotPosition == 2 ? styles.slotSelected : styles.slotUnSelect]}>2 Days</Text></TouchableOpacity>
                        </View>
                    </View>
                    {/** Pause Meal */}
                    <ImageIcon style={[styles.skipIcon, { marginTop: dimens.w10 }]} path={images.pauseMeal} />

                    <Text medium px18>Pause your meal</Text>
                    {/** Date Selectoin */}
                    <View style={{ flexDirection: 'row', marginTop: dimens.w2, }}>
                        {/** Start date */}
                        <TouchableOpacity onPress={() => {
                            isStartDate = true
                            dateRef.current.onPressDate()
                        }}
                            style={styles.dateRoot}>
                            <Text medium px14 primary flex1 style={{ marginEnd: dimens.w2 }}>
                                {startDate.length > 0 ? startDate : 'Start Date'}</Text>
                            <ImageIcon path={images.calendar} />
                        </TouchableOpacity>

                        {/** Start date */}
                        <TouchableOpacity onPress={() => {
                            isStartDate = false
                            dateRef.current.onPressDate()
                        }}
                            style={[styles.dateRoot, { marginStart: dimens.w5 }]}>
                            <Text medium px14 primary flex1 style={{ marginEnd: dimens.w2 }}>
                                {endDate.length > 0 ? endDate : 'End Date'}</Text>
                            <ImageIcon path={images.calendar} />
                        </TouchableOpacity>
                    </View>

                    {/**Sat sun */}
                    {/* <ImageIcon style={[styles.skipIcon, { marginTop: dimens.w10 }]} path={images.skipMeal} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: -dimens.w2 }}>
                        <Text medium px18 black>Delivery for Sat, Sun:</Text>
                        <Text bold px18 black flex1>{isSatSun ? ' ON' : ' OFF'}</Text>
                        <TouchableOpacity onPress={() => setIsSatSun(!isSatSun)}>
                            <ImageFast contain style={{ width: dimens.w9, height: dimens.w9 }}
                                source={isSatSun ? images.switch_on : images.switch_off} />
                        </TouchableOpacity>
                    </View> */}
                    {isShowSaveButton ?
                        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                            <Button onPress={() => callSkipPause()}
                                full style={{ paddingVertical: constants.btnPaddingVertical }} >
                                <Text transform='uppercase' boldSemi white >DONE</Text>
                            </Button>
                        </View> : null
                    }
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    slotCommon: {
        width: slotWidth,
        height: slotHeight,
        textAlign: 'center',
        textAlignVertical: 'center',
        paddingTop: constants.isAndroid ? 0 : dimens.w2o5,
        overflow: 'hidden',
        borderRadius: constants.borderRadius
    },
    slotSelected: {
        backgroundColor: colors.primary,
        color: 'white',

    },
    dateRoot: {
        flexDirection: 'row', flex: 1, alignItems: 'center',
        borderRadius: dimens.w2, borderColor: colors.primary, borderWidth: 0.5, padding: dimens.w3
    },
    slotUnSelect: {
        backgroundColor: colors.white,
        color: colors.primary,
        borderColor: colors.primary,
        borderWidth: 0.5,
    },
    skipIcon: {
        width: dimens.w9, height: dimens.w9, marginBottom: dimens.w2
    },
    mealDetailInnerRoot: {
        backgroundColor: 'white', marginTop: dimens.w2,
        borderRadius: constants.borderRadius, marginBottom: dimens.w8
    },
});
export default SkipPauseMeal;