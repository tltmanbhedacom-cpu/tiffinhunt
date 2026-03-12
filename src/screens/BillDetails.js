import React, { useEffect, useState, useRef } from "react";
import {
    TouchableOpacity, Dimensions, SafeAreaView, StyleSheet,
    Image, View, TextInput, Platform, Alert
} from 'react-native';
import { Loader, Button, Text, TextInputView, ImageIcon, SmallBlueDivider, ImageFast } from '../component'
import { constants, images, colors, styleApp, dimens, spacing, fontSize, font } from '../constants'
import { ScrollView } from "react-native-gesture-handler";
import RBSheet from "react-native-raw-bottom-sheet";
import AddressRowList from '../listitem/AddressRowList'
import { setSelectedAddress, setCart, userId, isLoggedIn } from '../utils/Session'
// import stripe from 'tipsi-stripe'
import { useSafeArea } from 'react-native-safe-area-context';
import { apiAddOrder, getAddress, orderPaymentv1, sendOTP, verifyOTP } from '../redux/api'
import { useDispatch, useSelector } from 'react-redux';
// import { placeOrderS, getAddressS, OnSelectAddress } from '../redux/actions/ActionCB'
import SlotList from '../listitem/SlotList'
import { EventEmitter}from '../utils/event'
import GuestLogin from "./GuestLogin";
import { getAddressS } from "../redux/reducers/AppReducer";
import { OnSelectAddress } from "../redux/reducers/MealReducer";


let slotTime = ['11AM-1PM', '1PM-3PM', '7PM-9PM', '9PM-11PM']
let slotWidth = constants.screenWidth / 2.3;
let slotHeight = slotWidth * 0.26

const moment = require('moment');
var addOnPrice = 0;
var mealDetailCartObj = {}
var dishList = []
var startDate = ''
var endDate = ''
var isWeekEnd = false;
var reqEndDate = ''
var addONlist = {}
const GST = 13
function BillDetails({ route, navigation }) {

    const dispatch = useDispatch();
    const guestLoginRefs = useRef();
    const [isFetching, setIsFetching] = useState(false);
    const [isSatSun, setIsSatSun] = useState(false)
    const [isDND, setIsDnd] = useState(false);
    const [subscription, setSubscription] = useState('');
    const [userMobile, setUserMobile] = useState('')
    const [ccode, setCode] = useState('+44')
    const [isOTPSent, setOTPSent] = useState(false)
    const [isVerified, setVerified] = useState(false)
    const [otp, setOTP] = useState('')
    const [deliverySlot, setDeliverySlot] = useState([])
    const [isGuest, setGuest] = useState(false)

    const dataReducer = useSelector((state) => state.MealReducer);
    const { mealDetail, selectedAddress } = dataReducer;

    //Address
    const appReducer = useSelector((state) => state.AppReducer);
    const { allAddress } = appReducer;

    var addressDialogRef = useRef()
    const insets = useSafeArea();
    useEffect(() => {
        addONlist = []
        var subscription = route.params.subscription;
        addONlist = route.params.addOnList
        console.log('subscription ', JSON.stringify(subscription))
        mealDetailCartObj = route.params.mealDetailCartObj;
        isWeekEnd = route.params.isWeekEnd;
        dishList = route.params.dishList
        reqEndDate = ''
        if (dishList != null && dishList.length > 0) {
            var year = new Date().getFullYear();
            var dishObj = dishList[0]
            startDate = moment(year + '-' + dishObj.month + '-' + dishObj.day, 'YYYY-MMM-DD')
            var tempStart = moment(year + '-' + dishObj.month + '-' + dishObj.day, 'YYYY-MMM-DD');
            endDate = tempStart.add(parseInt(subscription.subscription_days) - 1, 'days')
        }
        console.log('mealDetailmealDetail ****', route.params.delivery_slot)
        // if(route.params.hasOwnProperty(addOnPrice))
        addOnPrice = route.params.addOnPrice.toFixed(2)
        setDeliverySlot(route.params.delivery_slot)
        setSubscription(subscription)
        console.log('addOnPrice ', addOnPrice)
        console.log('allAddress ', allAddress)
        // if (allAddress.length <= 0) {
        //     callApiGetAddress(false)
        // }
        return () => {
            addONlist = {}
            reqEndDate = ''
            addOnPrice = 0;
            mealDetailCartObj = {}
        }
    }, []);


    function SmallBlueDivider() {
        return (<View style={styleApp.blueSmallDivider} />)
    }

    /**
     * Calculate Discount
     */
    function getDiscount() {
        var final = calculateTotal() * mealDetail.offer / 100;
        return final.toFixed(2)
    }

    /**
     * Calculate GST
     */

    function getGST() {
        var total = parseFloat(deliveryAmount());
        var gst = (total * GST ) / 100
        return parseFloat(gst).toFixed(2)
    }
    /**
     * Calculate Total
     */
    function calculateTotal() {
        // const mealPrice = subscription.subscription_price;
        const mealTotal = (subscription.subscription_price * subscription.subscription_days);
        var total = parseFloat(mealTotal) + parseFloat(subscription.delivery_charge) + parseFloat(addOnPrice)
        return (total.toFixed(2));
    }

    function deliveryAmount() {
        var total = calculateTotal();
        var discount = (total * mealDetail.offer / 100)
        var withDiscount = total - discount
        return withDiscount.toFixed(2)
    }

    function deliveryGSTAmount(){
        var total = parseFloat(deliveryAmount()) + parseFloat(getGST());
        return total.toFixed(2);
    }
    function goToAddress() {
        // navigation.navigate('Profile', {
        //     screen: 'Address',
        //     params: { isAddressSelect: true }
        // })
        addressDialogRef.current.close();
        navigation.push('AddAddress', { isAddressSelect: true })
    }
    function placeOrder(paymentId) {
        var selectedSlot = deliverySlot.filter(item => item.isSelected)[0].time_slot

        var param = {}
        param["category_id"] = mealDetail.category_id
        param["payemnt_id"] = paymentId
        param["subcategory_id"] = mealDetail.subcategory_id
        param["restaurant_id"] = mealDetail.id
        param["subscription_id"] = subscription.subscription_id
        param["subscription_day"] = subscription.subscription_days
        param["subscription_price"] = subscription.subscription_price
        param["is_weekend"] = isSatSun ? 1 : 0
        param["delivery_slot"] = selectedSlot
        param["delivery_amount"] = subscription.delivery_charge
        param["offer_amount"] = getDiscount()
        param["total_amount"] = calculateTotal()
        param["tax_amount"] = getGST()
        param["addon_amount"] = addOnPrice
        param["is_dnd"] = isDND ? 1 : 0
        param["address_id"] = selectedAddress.id
        param["plan_start_date"] = startDate.format('YYYY-MM-DD')
        param["plan_end_date"] = reqEndDate.format('YYYY-MM-DD')
        param["phone_no"] = userMobile
        param["addon_data"] = JSON.stringify(addONlist)


        // var param = new FormData();
        // param.append('category_id', mealDetail.category_id);
        // param.append('payemnt_id', paymentId)
        // param.append('subcategory_id', mealDetail.subcategory_id);
        // param.append('restaurant_id', mealDetail.id);
        // param.append('subscription_id', subscription.subscription_id);
        // param.append('subscription_day', subscription.subscription_days);
        // param.append('subscription_price', subscription.subscription_price);
        // param.append('is_weekend', isSatSun ? 1 : 0);
        // param.append('delivery_slot', selectedSlot);
        // param.append('delivery_amount', subscription.delivery_charge);
        // param.append('offer_amount', getDiscount());
        // param.append('total_amount', calculateTotal());
        // param.append('tax_amount', getGST());
        // param.append('addon_amount', addOnPrice)
        // param.append('is_dnd', isDND ? 1 : 0);
        // param.append('address_id', selectedAddress.id);
        // param.append('plan_start_date', startDate.format('YYYY-MM-DD'))
        // param.append('plan_end_date', reqEndDate.format('YYYY-MM-DD'))
        // param.append('phone_no', userMobile)
        // param.append('addon_data', JSON.stringify(addONlist))
        console.log(param)
        setIsFetching(true)
        apiAddOrder(param)
            .then(res => {
                console.log(res)
                navigation.navigate('OrderSuccess');
            })
            .catch(error => {
                if (mealDetailCartObj != null) setCart(mealDetailCartObj)
                setTimeout(() => {
                    alert(error)
                }, 500);
            })
            .finally(() => { setIsFetching(false) });

    }

    var isAddressSelected = selectedAddress && selectedAddress.hasOwnProperty('id');
    var isHomeAddress = selectedAddress.address_type == 1

    function setDurationDate() {
        // var isWeekEnd = subscription.subscription_days == 1;
        var addDays = 0;
        var subDays = subscription.subscription_days;
        var firstDish = dishList[0]
        if (!firstDish || firstDish == null) return (<View></View>)
        if (subDays == 7) {
            addDays = 2
        } else if (subDays == 14) {
            addDays = 4
        } else if (subDays == 28) {
            addDays = 8
        }
        var eDate = ''
        if (!isSatSun) {
            eDate = moment(endDate.format('YYYY-MM-DD'))
                .add(addDays, 'days')
        } else {
            eDate = moment(endDate.format('YYYY-MM-DD'))
        }
        reqEndDate = eDate;
        eDate = eDate.format('DD MMM')
        return (<Text medium px18 black flex1>{startDate.format('DD MMM')} -
            {eDate}</Text>)
    }

    function callApiGetAddress(isShowProgress) {
        if (isShowProgress) setIsFetching(true)
        getAddress()
            .then(res => {
                //  isLastRecord = orderList.length < constants.pageSize;
                if (res.length <= 0) goToAddress()
                dispatch(getAddressS(res))
                setTimeout(() => {
                    if (res.length > 0 && isShowProgress) addressDialogRef.current.open()
                }, 300);
            })
            .catch(error => alert(error))
            .finally(() => { if (isShowProgress) setIsFetching(false) });
    }

    function callApiOrderPayment(token) {
        var param = {}
        param["amount_val"] = deliveryGSTAmount()
        param["stripeToken"] = token

        // var param = new FormData();
        // param.append('amount_val', deliveryGSTAmount())
        // param.append('stripeToken', token)
        setIsFetching(true)
        orderPaymentv1(param)
            .then(res => {
                if (res.success) {
                    placeOrder(res.data.payemnt_id)
                } else {
                    alert(res.message)
                }
            })
            .catch(error => {
                setCart(mealDetailCartObj)
                setTimeout(() => {
                    alert(error)
                }, 500);
            })
            .finally(() => { setIsFetching(false) });
    }


    function OnRowAddressEvent(item) {
        dispatch(OnSelectAddress(item))
        addressDialogRef.current.close()
        setSelectedAddress(item)
    }

    function addressDialog() {
        return (<RBSheet
            ref={addressDialogRef}
            height={dimens.h70}
            duration={250}
            customStyles={{
                container: {
                    borderTopRightRadius: dimens.w5,
                    borderTopLeftRadius: dimens.w5
                }
            }}>
            <View style={{ flex: 1, width: '100%', }}>
                <TouchableOpacity onPress={() => addressDialogRef.current.close()} style={{ alignItems: 'center' }}>
                    <View style={{
                        width: dimens.w15, height: dimens.w1, marginBottom: dimens.w1, marginTop: dimens.w3,
                        backgroundColor: 'rgba(129,129,129,0.2)', borderRadius: dimens.wo5
                    }} />
                </TouchableOpacity>
                <View style={{ flex: 1, padding: dimens.w4 }}>
                    {allAddress.length > 0 ?
                        <AddressRowList
                            listData={allAddress}
                            onClick={OnRowAddressEvent} /> : null}

                </View>
                <View style={[styleApp.shadows, {
                    paddingHorizontal: dimens.w5, paddingBottom: dimens.w4,
                    paddingTop: dimens.w2
                }]}>
                    <Button onPress={() => goToAddress()}>
                        <Text white boldSemi px14>ADD NEW ADDRESS</Text>
                    </Button>
                </View>

            </View>
        </RBSheet>)
    }

  async  function changeAddress() {
        var isLogin = await isLoggedIn()
        if (isLogin <= 0) {
            constants.isGuestLogin =true;
            setGuest(!isGuest)
            return;
        }
        if (allAddress.length <= 0) {
            callApiGetAddress(true)
        } else {
            addressDialogRef.current.open()
        }
    }
    async function makePayment() {
        if (!selectedAddress || !selectedAddress.hasOwnProperty('id')) {
            if (allAddress.length <= 0) {
                callApiGetAddress(true)
            } else {
                addressDialogRef.current.open()
            }
            return
        }
        var selectedSlot = deliverySlot.filter(item => item.isSelected)[0]
        if (!selectedSlot || !selectedSlot.hasOwnProperty('time_slot')) {
            alert('Please select delivery slot.');
            return
        }
        const tokenObj = {}
        // const tokenObj = await stripe.paymentRequestWithCardForm({
        //     smsAutofillDisabled: true,
        // })
        var token = tokenObj.tokenId
        console.log('Stripe : ', JSON.stringify(token))
        callApiOrderPayment(token)
    }

    async function callApiSendOTP() {
        var isLogin = await isLoggedIn()
        if (isLogin <= 0) {
            constants.isGuestLogin =true;
            setGuest(!isGuest)
            return;
        }
        if (!userMobile || userMobile.length <= 7) {
            alert('Please enter valid mobile number.');
            return
        }
        var param ={}
        param["mobile_no"] = userMobile
        param["user_id"] = await userId()

        // var param = new FormData();
        // param.append('mobile_no', userMobile)
        // param.append('user_id', await userId())
        setIsFetching(true)
        sendOTP(param)
            .then(res => {
                if (res.success) {
                    setOTPSent(true)
                } else {
                    alert(res.message)
                }
            })
            .catch(error => {
                setCart(mealDetailCartObj)
                setTimeout(() => {
                    alert(error)
                }, 500);
            })
            .finally(() => { setIsFetching(false) });
    }

    function callVerifyOTP() {
        if (!otp) {
            alert("Please enter OTP");
            return
        }
        var param = {}
        param["order_otp"] = otp

        // var param = new FormData();
        // param.append('order_otp', otp)
        setIsFetching(true)
        verifyOTP(param)
            .then(res => {
                if (res.success) {
                    setVerified(true)
                } else {
                    alert(res.message)
                    setVerified(false)
                }
            })
            .catch(error => {
                setCart(mealDetailCartObj)
                setTimeout(() => {
                    alert(error)
                    setVerified(false)
                }, 500);
            })
            .finally(() => { setIsFetching(false) });
    }

    function OnSlotSelect(position, item) {
        var tempSlot = [...deliverySlot];
        for (let index = 0; index < tempSlot.length; index++) {
            tempSlot[index] = { ...tempSlot[index], isSelected: position == index }
        }
        setDeliverySlot(tempSlot)

    }
    return (
        <View style={[styleApp.container, { paddingTop: insets.top, }]}>
            <Loader loading={isFetching} />
            {addressDialog()}
            <View style={styleApp.container}>
                <Loader loading={isFetching} />
                {/** Header */}
                <View style={[, { flexDirection: 'row', alignItems: 'center', marginTop: dimens.w2 }]}>
                    <ImageIcon big path={images.back}
                        onClick={() => navigation.goBack()} />
                    <View style={{ flexDirection: 'column', marginStart: dimens.w2, flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <ImageIcon path={mealDetail.is_type == 1 ? images.vegGreen : images.nonVeg} />
                            <Text black px18 medium flex1 style={{ marginStart: dimens.w2 }}>{mealDetail.restaurant_name}</Text>
                        </View>
                        <Text medium black50 px14>{constants.bullet} {mealDetail.user_name}  {constants.bullet} {mealDetail.address}</Text>
                    </View>
                </View>
                <ScrollView>
                    <View style={[styleApp.container, spacing.viewPadding, { paddingBottom: dimens.h30 }]}>
                        {/** Flexible Plan */}
                        <Text boldSemi px20 black>Plan Duration</Text>
                        <SmallBlueDivider />
                        {/** Date */}
                        <View style={{ flexDirection: 'row', marginTop: dimens.w1, alignItems: 'center' }}>
                            {setDurationDate()}
                            <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: dimens.w1 }}>
                                <Text px14 primary bold>change</Text>
                            </TouchableOpacity>
                        </View>
                        {/** Sat Sun */}
                        <View style={{
                            flexDirection: 'row', alignItems: 'center',
                            display: (subscription.subscription_days == 2) ||
                                isWeekEnd != 1 ? 'none' : 'flex'
                        }}>
                            <Text medium px18 black>Delivery for Sat, Sun:</Text>
                            <Text bold px18 black flex1>{isSatSun ? ' ON' : ' OFF'}</Text>
                            <TouchableOpacity onPress={() => setIsSatSun(!isSatSun)}>
                                <ImageFast contain style={{ width: dimens.w9, height: dimens.w9 }}
                                    source={isSatSun ? images.switch_on : images.switch_off} />
                            </TouchableOpacity>
                        </View>
                        {/** Deilvery Slot */}
                        <Text boldSemi px20 black flex1 style={{ marginTop: dimens.w1 }} >Select Delivery Slot</Text>
                        <SmallBlueDivider />
                        <SlotList
                            listData={deliverySlot}
                            onClick={OnSlotSelect}
                        />

                        <View style={[spacing.viewPaddingVertical]}>
                            {/** Flexible Plan */}
                            <View style={{ flexDirection: 'row' }}>
                                <Text boldSemi px20 black flex1>Mobile number</Text>
                                <TouchableOpacity onPress={() => {
                                    setVerified(false)
                                    setOTPSent(false)
                                }}>
                                    <Text boldSemi px16 primary>Reset</Text>
                                </TouchableOpacity>

                            </View>

                            <SmallBlueDivider />
                            {isOTPSent ?
                                <View style={{ flexDirection: 'row', marginTop: dimens.w1 }}>
                                    <View style={[styles.mobileObrder,]}>
                                        <TextInput
                                            style={[styles.txtInput]}
                                            onChangeText={text => setOTP(text)}
                                            maxLength={6}
                                            placeholder='Please enter OTP'
                                            keyboardType='phone-pad'
                                            value={otp} />
                                        <View style={styles.btnVerify}>
                                            <ImageIcon touchableStyle={{
                                                marginEnd: dimens.w4,
                                                display: !isVerified ? 'flex' : 'none'
                                            }}
                                                path={images.resend} onClick={() => {
                                                    callApiSendOTP()
                                                }} />
                                            <Button onPress={() => callVerifyOTP()}>
                                                <Text boldSemi white px10>Verify</Text>
                                            </Button>
                                        </View>
                                    </View>
                                </View>
                                : <View style={{ flexDirection: 'row', marginTop: dimens.w1 }}>
                                    <View style={{ flexDirection: 'row', flex: 1 }}>
                                        <View style={[styles.mobileObrder, { flex: 0, width: dimens.w20, paddingHorizontal: dimens.w3 }]}>
                                            <ImageIcon path={images.uk} />
                                            <TextInput
                                                style={[styles.txtInput, { paddingStart: 0, marginStart: dimens.w1 }]}
                                                onChangeText={text => setCode(text)}
                                                maxLength={3}
                                                editable={false}
                                                keyboardType='phone-pad'
                                                value={ccode}
                                            />
                                        </View>
                                        <View style={[styles.mobileObrder, { marginStart: dimens.w2 }]}>
                                            <TextInput
                                                style={[styles.txtInput]}
                                                onChangeText={text => setUserMobile(text)}
                                                maxLength={10}
                                                placeholder='Enter mobile number'
                                                keyboardType='phone-pad'
                                                value={userMobile} />
                                            <View style={styles.btnVerify}>
                                                <Button onPress={() => callApiSendOTP()}>
                                                    <Text boldSemi white px10>Verify</Text>
                                                </Button>
                                            </View>
                                        </View>
                                    </View>
                                </View>}

                            <Text regular px12 color={colors.green}
                                style={{ marginTop: dimens.w1, display: isVerified || isOTPSent ? 'flex' : 'none' }}
                            >{isOTPSent && !isVerified ? 'Your OTP is sent to ' + userMobile
                                : 'Your mobile number verified successfully!'} </Text>
                        </View>
                        {/** Bill Details */}
                        <View style={[styleApp.shadows, styles.mealDetailInnerRoot, { marginVertical: dimens.w2, padding: dimens.w2 }]}>
                            <Text boldSemi px20 black style={{ marginBottom: dimens.w1 }}>Tiffin will start from next day</Text>
                            {/** Meal Price */}
                            <View style={styles.billItem}>
                                <Text medium px14 black50 flex1>Meal Price</Text>
                                <Text medium px14 black>{constants.currency}{subscription.subscription_price}</Text>
                            </View>
                            {/** Customisation */}
                            <View style={styles.billItem}>
                                <Text medium px14 black50 flex1>Add/Customisation</Text>
                                <Text medium px14 black>{constants.currency}{addOnPrice}</Text>
                            </View>

                            {/** Meal Subtotal*/}
                            <View style={styles.billItem}>
                                <Text medium px14 black50 flex1>Meal Subtotal</Text>
                                <Text medium px14 black>{constants.currency}{subscription.subscription_price}
                                    x {subscription.subscription_days} days</Text>
                            </View>
                            {/** Delivery Fee */}
                            <View style={styles.billItem}>
                                <Text medium px14 black50 flex1>Delivery Fee</Text>
                                <Text medium px14 black>{constants.currency}{subscription.delivery_charge}</Text>
                            </View>
                            {/** GST */}
                            <View style={styles.billItem}>
                                <Text medium px14 black50 flex1>
                                    VAT
                                    {/* Tax : HST/GST */}
                                    </Text> 
                                <Text medium px14 black>{constants.currency}{getGST()}</Text>
                            </View>
                            {/** Offer 10% OFF */}
                            {mealDetail.offer > 0 ?
                                <View style={styles.billItem}>
                                    <Text medium px14 black50 flex1>Offer {mealDetail.offer}% OFF</Text>
                                    <Text medium px14 black>-{constants.currency}{getDiscount()}</Text>
                                </View> : null
                            }
                            <View style={{ backgroundColor: colors.divider, height: 1, marginVertical: dimens.w1 }} />
                            {/** Total */}
                            <View style={styles.billItem}>
                                <Text boldSemi px16 black flex1>To Pay</Text>
                                <Text boldSemi px16 black>{constants.currency}{deliveryGSTAmount()}</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                {/**Address */}
                <View style={[styles.addressRoot, styleApp.shadows]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: dimens.w1o3 }}>
                        {/** Address Title */}
                        {isAddressSelected ?
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <ImageIcon path={isHomeAddress ? images.addAddressHome : images.work} />
                                <Text boldSemi px16 black flex1 style={{ marginStart: dimens.w2, marginTop: dimens.wo5 }}>
                                    Deliver to {isHomeAddress ? 'Home' : 'Work'}</Text>
                                <TouchableOpacity
                                    onPress={() => changeAddress()}
                                    style={{ padding: dimens.w2, margin: -dimens.w2 }}>
                                    <Text bold px12 primary underline>CHANGE</Text>
                                </TouchableOpacity>
                            </View> : null}


                    </View>
                    {/** Address */}
                    <TouchableOpacity onPress={() => {changeAddress()
                        // if (allAddress.length > 0) {
                        //     addressDialogRef.current.open()
                        // } else {
                        //     callApiGetAddress(true)
                        // }
                    }}>
                        <Text numberOfLines={1} bold px16 primary flex1>{isAddressSelected ? selectedAddress.house_no + ' ' + selectedAddress.landmark + ', '
                            + selectedAddress.city_name + ' ' + selectedAddress.pincode : 'Select Address'}</Text>
                    </TouchableOpacity>

                    {/** DND */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: dimens.wo5 }}>
                        <Text medium px14 black flex1>Do not disturb: Drop at security/reception</Text>
                        <TouchableOpacity onPress={() => setIsDnd(!isDND)}>
                            <ImageFast contain style={{ width: dimens.w7, height: dimens.w7 }}
                                source={isDND ? images.checkSquare : images.uncheckSquare} />
                        </TouchableOpacity>
                    </View>
                    <Button disabled={!isVerified} full style={{
                        paddingVertical: dimens.w3,
                        opacity: isVerified ? 1.0 : 0.5,
                        marginBottom: insets.bottom
                    }}
                        onPress={() => makePayment()}>
                        <Text boldSemi white >MAKE PAYMENT</Text>
                    </Button>
                </View>
                {isGuest?<GuestLogin isShow={isGuest} navigation={navigation}
                     onFinish={()=>setGuest(false)}/> : null}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    btnVerify: {
        position: 'absolute', right: 0, marginEnd: dimens.w2,
        flexDirection: 'row', alignItems: 'center'
    },
    mobileObrder: {
        flex: 1,
        borderRadius: 4,
        borderStyle: 'solid',
        borderColor: colors.borderColor,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    txtInput: {
        width: '100%',
        height: 40,
        paddingHorizontal: dimens.w3,
        fontSize: fontSize.FONT_14Px,
        fontFamily: font.regular,
        color :'black'
    },
    slotCommon: {
        width: slotWidth,
        height: slotHeight,
        textAlign: 'center',
        textAlignVertical: 'center',
        overflow: 'hidden',
        paddingTop: constants.isAndroid ? 0 : dimens.w2o5,
        borderRadius: constants.borderRadius
    },
    slotSelected: {
        backgroundColor: colors.primary,
        color: 'white',

    },
    slotUnSelect: {
        backgroundColor: colors.white,
        color: colors.primary,
        borderColor: colors.primary,
        borderWidth: 0.5,
    },
    billItem: {
        flexDirection: 'row',
        marginVertical: dimens.wo5
    },
    addressRoot: {
        position: 'absolute', backgroundColor: 'white', width: '100%', paddingHorizontal: dimens.w3,
        bottom: 0, paddingTop: dimens.w2, paddingBottom: dimens.w3,
    },
    mealDetailInnerRoot: {
        backgroundColor: 'white', marginTop: dimens.w2,
        borderRadius: constants.borderRadius, marginBottom: dimens.w8
    },
});
export default BillDetails;