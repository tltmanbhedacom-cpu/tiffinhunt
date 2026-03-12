import React, { useState, useContext, useEffect } from 'react';
import {
    View, TouchableOpacity, Keyboard, Alert, StyleSheet,
    ScrollView, KeyboardAvoidingView, SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Loader, Button, Text, TextInputView, ImageIcon, ImageFast, ScalableImage } from '../component'
import { constants, images, colors, styleApp, dimens, spacing, strings, keys } from '../constants'
import { connect } from 'react-redux';
import * as appAction from '../redux/actions/AppAction'
import FacebookIntegrationClass from '../socialmedia/FacebookIntegration';
import GooglePlusIntegrationClass from '../socialmedia/GooglePlusIntegration';
import { checkPassword } from '../utils/Utils'
import { setClientToken } from '../utils/API'
import { setToken } from '../utils/Session'
import { apiRegister } from '../redux/api'
var isErrorUserName;
var isErrorEmail;
var isErrorPassword;
export default function Register({ route, navigation }) {

    const [username, setusername] = useState('')
    const [emailId, setemailId] = useState('')
    const [password, setpassword] = useState('')
    const [isReload, setisReload] = useState(false)
    const [isTerms, setisTerms] = useState(false)
    const [isFetching, setIsFetching] = useState(false);
    const [isGuestLogin, setGuestLogin] = useState(route.params && route.params.isGuestLogin)

    useEffect(() => {
        isErrorEmail = false;
        isErrorPassword = false;
        isErrorPassword = false;
        GooglePlusIntegrationClass.getInstance().initializeGooglePlusSdk();
        return () => {
            isErrorEmail = false;
            isErrorPassword = false;
            isErrorPassword = false;
        }
    }, [])

    function validate() {
        if (!isTerms) {
            alert(strings.errorTc)
            return
        }
        Keyboard.dismiss();
        isErrorUserName = (!username || username.length <= 0);
        isErrorEmail = (!emailId || emailId.length <= 0);
        isErrorEmail = !validateEmail(emailId)
        isErrorPassword = (!password || password.length <= 0);
        isErrorPassword = !checkPassword(password)
        if (isErrorUserName || isErrorEmail || isErrorPassword) {
            setisReload(!isReload)
            return;
        }

        var bodyFormData = {}
        bodyFormData["name"] = username
        bodyFormData["email"] = emailId
        bodyFormData["password"] = password
        bodyFormData["device_token"] = 'dummy'
        bodyFormData["device_type"] = constants.deviceType

        // var bodyFormData = new FormData();
        // bodyFormData.append('name', username)
        // bodyFormData.append('email', emailId);
        // bodyFormData.append('password', password);
        // bodyFormData.append('device_token', 'dummy');
        // bodyFormData.append('device_type', constants.deviceType);
        callApiRegister(bodyFormData)
    }

    function callApiRegister(bodyFormData) {
        setIsFetching(true)
        apiRegister(bodyFormData)
            .then(res => {
                GoToHome(res)
            })
            .catch(error => setTimeout(() => {
                alert(error)
            }, 200))
            .finally(() => setIsFetching(false));
    }

    function GoToHome(data) {
        console.log(data)
        AsyncStorage.setItem(keys.token, JSON.stringify(data.token)).then(() => {
            AsyncStorage.setItem(keys.userId, data.data.id + '').then(() => {
                AsyncStorage.setItem(keys.user, JSON.stringify(data.data)).then(() => {
                    AsyncStorage.setItem('isLoggedIn', '1').then(() => {
                        AsyncStorage.setItem('isGuest', '0').then(() => {
                            setClientToken(JSON.stringify(data.token))
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'TabStack' }],
                            });
                        });
                    });
                });
            });
        });
    }

    async function updateToken(tokenBarier) {
        console.log('TOKEN ==> ', tokenBarier)
        await setToken(tokenBarier)
        setClientToken(JSON.stringify(tokenBarier))
    }

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };
    function validateSocial(name, email, id, type) {
        Keyboard.dismiss();

        var bodyFormData = {}
        bodyFormData["name"] = name
        bodyFormData["email"] = email ? email : ''
        bodyFormData["password"] = ""
        bodyFormData["device_token"] = 'dummy'
        bodyFormData["device_type"] = constants.deviceType
        bodyFormData["google_id"] = type == 1 ? id : ''
        bodyFormData["facebook_id"] = type == 2 ? id : ''


        // var bodyFormData = new FormData();
        // bodyFormData.append('name', name)
        // bodyFormData.append('email', email ? email : '');
        // bodyFormData.append('password', '');
        // bodyFormData.append('device_token', 'dummy');
        // bodyFormData.append('device_type', constants.deviceType);
        // bodyFormData.append('google_id', type == 1 ? id : '')
        // bodyFormData.append('facebook_id', type == 2 ? id : '')
        console.log('SOICAL REGI : ', bodyFormData)
        callApiRegister(bodyFormData)
    }

    // This Method Use Handle Login With Facebook Click Event
    function loginFacebook() {
        if (!isTerms) {
            alert(strings.errorTc)
            return
        }
        FacebookIntegrationClass.getInstance().loginWithFacebook((cb, type) => {
            if (type == 1) {
                var userInfo = cb;
                validateSocial(userInfo.name, userInfo.email, userInfo.id, 2)
            }
            else {
                Alert.alert(cb)
            }
        });
    }
    // This Method Use Handle Login With Google Plus Click Event
    function loginGooglePlus() {
        if (!isTerms) {
            alert(strings.errorTc)
            return
        }
        GooglePlusIntegrationClass.getInstance().loginWithGooglePlus((cb, type) => {
            if (type == 1) {
                var userInfo = cb;
                validateSocial(userInfo.name, userInfo.email, userInfo.id, 1)
            }
            else {
                Alert.alert(cb)
            }
        });
    }


    function setBottomImage() {
        return (
            <View style={styles.bottomImg}>
                <ScalableImage
                    width={constants.screenWidth}
                    source={images.bottomHalf} />

            </View>
        )
    }
    function signInClick() {
        if(isGuestLogin){
            constants.isGuestLogin =false
            navigation.navigate('Login')
        }else{
            navigation.goBack()
        }
    }
    return (
        <SafeAreaView style={[styleApp.container]}>
            <KeyboardAvoidingView style={{ marginBottom: dimens.h25, flex: 1, width: '100%' }}
                behavior={!constants.isAndroid ? 'padding' : null}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ alignItems: 'center' }}>
                        <Loader loading={isFetching} />
                        <ImageFast
                                contain
                                style={{ width: dimens.w30, height: dimens.w30 }}
                                source={images.splashIcon} />
                        <View style={{flex :1,position:'absolute',left:0,right:0,alignItems:'flex-end'}}>
                            <ImageIcon path={images.closeGray} touchableStyle={{padding:dimens.w5}}
                                onClick={() => navigation.goBack()} />
                            </View>

                        <View style={[spacing.viewPaddingHorizontal, spacing.container]}>
                            <View>
                                <TextInputView style={styleApp.textInputPadding}
                                    attrName='username'
                                    title='NAME'
                                    headerTitle='Name'
                                    placeholder='Name'
                                    errorText='Please enter name.'
                                    isError={isErrorUserName}
                                    titleTextColor={colors.fontAb9a9d}
                                    isBorder={true}
                                    value={username}
                                    updateMasterState={(a, b) => setusername(b)} />
                            </View>
                            <View style={{ marginTop: dimens.h1 }}>
                                <TextInputView style={styleApp.textInputPadding}
                                    attrName='emailId'
                                    title='EMAIL ID'
                                    headerTitle='Email ID'
                                    placeholder='Email ID'
                                    errorText='Please enter valid email ID.'
                                    isError={isErrorEmail}
                                    titleTextColor={colors.fontAb9a9d}
                                    isBorder={true}
                                    email
                                    actionNext
                                    autoCapNone
                                    value={emailId}
                                    updateMasterState={(a, b) => setemailId(b)} />
                            </View>
                            <View style={{ marginTop: dimens.h1 }}>
                                <TextInputView style={[styleApp.textInputPadding]}
                                    attrName='password'
                                    title='PASSWORD'
                                    headerTitle='Password'
                                    placeholder='Password'
                                    errorText={strings.errorPassword}
                                    isError={isErrorPassword}
                                    titleTextColor={colors.fontAb9a9d}
                                    isBorder={true}
                                    secure
                                    value={password}
                                    updateMasterState={(a, b) => setpassword(b)} />
                            </View>
                            {/** T and C */}
                            <View style={{ marginTop: dimens.w2, flexDirection: "row", }}>
                                <ImageIcon
                                    onClick={() => setisTerms(!isTerms)}
                                    path={isTerms ? images.checkSquare : images.uncheckSquare} />
                                <View style={{ marginStart: dimens.w2 }}>
                                    <Text regular px14>By clicking Sign Up, you agree to our</Text>
                                    <Text regular px14>Terms and that you have read our </Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TouchableOpacity onPress={() => navigation.navigate('WebViews',
                                            { title: strings.accountSecurity, url: strings.urlAccountSecurity })}>
                                            <Text regular px14 primary underline>account security</Text>
                                        </TouchableOpacity>
                                        <Text regular px14> and </Text>
                                        <TouchableOpacity onPress={() => navigation.navigate('WebViews',
                                            { title: strings.PrivacyPolicy, url: strings.urlPrivacy })}>
                                            <Text regular px14 primary underline>privacy policy</Text>
                                        </TouchableOpacity>
                                    </View>


                                </View>
                                <Text boldSemi px16 black flex1></Text>
                            </View>
                            <Button style={[styleApp.buttonPadding, { marginTop: dimens.h2 }]}
                                full
                                onPress={() => validate()}>
                                <Text boldSemi px14 white transform='uppercase'>Sign Up</Text>
                            </Button>
                            {/* <Text center grayLight boldSemi px18 style={{ marginVertical: dimens.h1 }}>or</Text>
                            <View style={{ flexDirection: 'row', }} >
                                <Button
                                    style={{ flex: 1 }}
                                    onPress={() => loginGooglePlus()}
                                    outline iconLeft={images.google}>
                                    <Text center black px14 regular>Google</Text>
                                </Button>
                                <Button
                                    style={{ flex: 1, marginStart: dimens.w6 }}
                                    onPress={() => loginFacebook()}
                                    outline iconLeft={images.fb}>
                                    <Text center black px14 regular>Facebook</Text>
                                </Button>
                            </View> */}
                            <View style={styles.noMember}>
                            <Text grayLight boldSemi px16>Already member.</Text>
                            <TouchableOpacity
                                onPress={() => signInClick()}>
                                <Text style={{ marginLeft: 5 }} primary px14 bold underline>Sign in</Text>
                            </TouchableOpacity>
                        </View> 
                            
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            {setBottomImage()}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    noMember: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: dimens.h1,
        alignItems: 'center'
    },

    signUpButtonStyle:
    {
        paddingVertical: 15,
        marginTop: 20,
    },
    bottomImg: {
        bottom: 0,
        position: 'absolute',
        marginTop: -dimens.w5
    }

})
