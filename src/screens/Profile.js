import React, { Component, useState, useEffect, useRef } from 'react';
import {
    TouchableOpacity, Dimensions, ActivityIndicator, StyleSheet,
    Image, View, Platform, Alert, SafeAreaView, TextInput
} from 'react-native';
import { Loader, Button, Text, ImageIcon, ImageFast, ScalableImage } from '../component'
import { images, colors, styleApp, dimens, spacing, strings, constants, fontSize, font } from '../constants'
import { SettingType } from '../constants/emuns'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getUser, setUserObject, isLoggedIn } from '../utils/Session'
import RBSheet from "react-native-raw-bottom-sheet";
// import { OnLogout } from '../redux/actions/ActionCB'
import { editProfile } from '../redux/api'
import { useDispatch, useSelector } from 'react-redux';
import { EventEmitter } from '../utils/event'
import GuestLogin from "./GuestLogin";
import { useFocusEffect } from '@react-navigation/native';
import { OnLogout } from '../redux/reducers/AppReducer';
import { OnLogout as OnMealLogout } from '../redux/reducers/MealReducer';


function Profile({ route, navigation }) {
    const dispatch = useDispatch();
    const [user, setUser] = useState({});
    const [userMobileNo, setUserMobileNo] = useState('')
    const [ccode, setCode] = useState('+44')
    const [mobileNumber, setMobileNumber] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isGuest, setGuest] = useState(false)
    const [isUserLogin, setUserLogin] = useState(-1)

    const guestLoginRefs = useRef();
    const editProfileRefs = useRef();

    useEffect(() => {
        getUserData();
        console.log(user)
        return () => {
        }
    }, []);

    useFocusEffect(

        React.useCallback(() => {
            let isActive = true;
            
            getUserData()

            if (isActive && isUserLogin) {
                // getUserData()
            }
            return () => {
                isActive = false;
            };
        }, [])
    );


    async function getUserData() {
        var us = await getUser();
        var isLogin = await isLoggedIn();
        setUserLogin(isLogin)
        if (isLogin) {
            setUser(us)
            setMobileNumber(us.mobile_no)
            console.log('user ', us)
        }
    }

    function ProfileMenu({ type, title, icon }) {
        return (
            <TouchableOpacity onPress={() => {
                if (isUserLogin <= 0) {

                    if(type == SettingType.PRIVACY_POLICY){
                        navigation.push('WebViews', { title: strings.PrivacyPolicy, url: strings.urlPrivacy })
                        return
                    }
                    else{
                        constants.isGuestLogin = true;
                        setGuest(!isGuest)
                        return;
                    }
                   
                }
                switch (type) {
                    case SettingType.MY_TIFFIN_PLAN:
                        navigation.navigate({ name: 'MyTiffinPlan' })
                        break;
                    case SettingType.MANAGE_ADDRESS:
                        navigation.navigate({ name: 'Address', key: 'stackAddres' })
                        break;
                    case SettingType.FAVORITES:
                        navigation.navigate('Favorites')
                        break;
                    case SettingType.PAYMENTS:
                        navigation.navigate('Payment')
                        break;
                    case SettingType.PRIVACY_POLICY:
                        navigation.push('WebViews', { title: strings.PrivacyPolicy, url: strings.urlPrivacy })
                        break;
                    case SettingType.HELP:
                        navigation.push('Help')
                        break
                }
            }}>
                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: dimens.w4 }}>
                        <ImageIcon path={icon} />
                        <Text regular black px14 style={{ marginStart: dimens.w3 }}>{title}</Text>
                    </View>
                    <View style={{ width: '93%', height: 0.5, backgroundColor: colors.divider, marginTop: dimens.w4 }} />
                </View>
            </TouchableOpacity>
        )
    }

    function callApiEditProfile() {
        editProfileRefs.current.close();
        setTimeout(() => {
            if (ccode.trim().length <= 0) {
                alert('Please enter country code');
                return
            }
            if (mobileNumber.trim().length <= 0) {
                alert('Please enter mobile number')
                return
            }
            setIsLoading(true)

            var parma = {}
            parma["country_code"] = "1"
            parma["mobile_no"] = mobileNumber
            parma["name"] = user.name

            // const parma = new FormData();
            // parma.append('country_code', '1')
            // parma.append('mobile_no', mobileNumber)
            // parma.append('name', user.name)

            editProfile(parma)
                .then(res => {
                    console.log(res)
                    var mobileC = mobileNumber
                    setMobileNumber(mobileC)
                    var tempuser = user;
                    tempuser.mobile_no = mobileC
                    setUserObject(tempuser)
                })
                .catch(error => alert(error))
                .finally(() => { setIsLoading(false) });
        }, 500);
    }

    function editProfileDialog() {
        return (<RBSheet
            ref={editProfileRefs}
            // height={100}
            duration={250}
            customStyles={{
                container: {
                    borderTopRightRadius: dimens.w5,
                    borderTopLeftRadius: dimens.w5
                }
            }}>
            <View style={{ width: '100%', padding: dimens.w5 }}>
                <TouchableOpacity onPress={() => editProfileRefs.current.close()} style={{ alignItems: 'center' }}>
                    <View style={{
                        width: dimens.w15, height: dimens.w1, marginBottom: dimens.w1,
                        backgroundColor: 'rgba(129,129,129,0.2)', borderRadius: dimens.wo5
                    }} />
                </TouchableOpacity>
                <Text boldSemi px20 style={{ marginTop: dimens.h1 }}>EDIT ACCOUNT</Text>
                <Text regular px12 style={{ marginTop: dimens.h1 }}>Mobile number</Text>
                <View style={{ flexDirection: 'row', marginBottom: dimens.w3 }}>
                    <View style={[{
                        width: dimens.w20, flexDirection: 'row', alignItems: 'center',
                        paddingStart: dimens.w5
                    }, styles.txtInputBorder]}>
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
                    <View style={{ flex: 1, marginStart: dimens.w2 }}>
                        <TextInput
                            style={[styles.txtInput, styles.txtInputBorder]}
                            onChangeText={text => setMobileNumber(text)}
                            maxLength={10}
                            keyboardType='phone-pad'
                            value={mobileNumber}
                        />
                    </View>
                </View>
                <Button onPress={() => callApiEditProfile()}>
                    <Text white boldSemi px14>CONTINUE</Text>
                </Button>
            </View>
        </RBSheet>)
    }
    async function logoutUser() {
        await AsyncStorage.clear();
        dispatch(OnLogout())
        dispatch(OnMealLogout())
        constants.isGuestLogin = false
        navigation.reset({
            index: 0,
            routes: [{ name: 'Auth' }],
        });
    }

    console.log('isUserLogin ', isUserLogin)
    return (

        <SafeAreaView style={styleApp.safeAreaRoot}>
            <Loader loading={isLoading} />
            {editProfileDialog()}
            <View style={[styleApp.container, spacing.viewPadding]}>
                {isUserLogin > 0 ?
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text boldSemi px20 flex1 transform={'capitalize'}>{user.name}</Text>
                        <TouchableOpacity onPress={() => editProfileRefs.current.open()}>
                            <Text primary px14 medium>Edit</Text>
                        </TouchableOpacity>
                    </View> : isUserLogin <= 0 ? <Text boldSemi px20 transform={'capitalize'}>Guest User</Text> : null
                }

                <Text medium px14 black50>{user.mobile_no}{user.mobile_no && user.mobile_no.length > 0
                    ? ' ' + constants.bullet + ' ' : ''}{user.email}</Text>

                <View style={{ flexDirection: 'column', marginTop: dimens.w5 }}>
                    <ProfileMenu type={SettingType.MY_TIFFIN_PLAN} title={'My Tiffin & plans'} icon={images.myplan} />
                    <ProfileMenu type={SettingType.MANAGE_ADDRESS} title={'Manage Addresses'} icon={images.addAddressHome} />
                    <ProfileMenu type={SettingType.PAYMENTS} title={'Payments & history'} icon={images.payments} />
                    <ProfileMenu type={SettingType.FAVORITES} title={'Favourites'} icon={images.favourite} />
                    <ProfileMenu type={SettingType.HELP} title={'Help'} icon={images.help} />
                    <ProfileMenu type={SettingType.PRIVACY_POLICY} title={strings.PrivacyPolicy} icon={images.privacy_policy} />
                    <TouchableOpacity onPress={async () => logoutUser()}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: dimens.w5 }}>
                            <ImageIcon path={images.logout} />
                            <Text regular black px14 flex1 style={{ marginStart: dimens.w3 }}>{isUserLogin ? 'Logout' : 'Login'}</Text>
                            <Text regular black50 px14>App Version 1.1</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {isGuest ? <GuestLogin isShow={isGuest}  navigation = {navigation} onFinish={(isLogin) => {
                    setGuest(false)
                    setUserLogin(isLogin)
                }} /> : null}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    imgCommonStyle:
    {
        width: dimens.w5,
        height: dimens.w5,
        justifyContent: 'center',
        marginRight: dimens.w5,
    },
    txtInputBorder: {
        borderRadius: 4,
        borderStyle: 'solid',
        borderColor: colors.borderColor,
        borderWidth: 1,

    },
    txtInput: {
        width: '100%',
        height: 40,
        paddingHorizontal: dimens.w3,

        fontSize: fontSize.FONT_14Px,
        fontFamily: font.regular
    }
})
export default Profile;