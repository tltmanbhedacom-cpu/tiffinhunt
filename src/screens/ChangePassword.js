import React, { useEffect, useState } from "react";
import { TouchableOpacity, Dimensions, SafeAreaView, StyleSheet, Image, View, FlatList, Platform, Alert } from 'react-native';
import { Loader, Button, Text, TextInputView, ImageIcon, ScalableImage, Header } from '../component'
import { constants, images, colors, styleApp, dimens, spacing, strings } from '../constants'
import { useDispatch, useSelector } from 'react-redux';
import { apiChangePassword } from '../redux/api'
import { checkPassword } from '../utils/Utils'
import {EventEmitter } from '../utils/event'

var isErrorPass1 = false;
var isErrorOTP = false;
var isErrorPass2 = false;
var isErrorOtp = false;
export default function ForgotPassword({ route, navigation }) {
    const dispatch = useDispatch();
    const [isFetching, setIsFetching] = useState(false);
    const [pass1, setPass1] = useState('')
    const [pass2, setPass2] = useState('')
    const [otp, setOtp] = useState('')
    const [reload, setReload] = useState(false)
    useEffect(() => {
        return () => {
            console.log('COMPONENT  unmount');
        }
    }, []);


    function setBottomImage() {
        return (
            <View style={styles.bottomImg}>
                <ScalableImage
                    width={constants.screenWidth}
                    source={images.bottomHalf} />

            </View>
        )
    }

    function validate() {
        var isError = false;
        isErrorPass1 = false;
        isErrorOTP = false;
        isErrorPass2 = false;

        console.log(otp.trim.length )
        if (otp.trim().length <= 0) {
            isErrorOTP = true;
            isError = true;
        } 
        if (pass1.trim().length <= 0 || !checkPassword(pass1)) {
            isErrorPass1 = true;
            isError = true;
        } 
        if (pass2.trim().length <= 0) {
            isErrorPass2 = true;
            isError = true;
        } 

        if (pass1 != pass2) {
            alert('Password does not match')
            setPass1('')
            setPass2('')
            isError = true;
            return
        } 
        setReload(!reload)
        if (!isError) {
            var param = {}
            param["reset_code"]= otp
            param["new_password"]= pass1

            // var param = new FormData();
            // param.append('reset_code', otp);
            // param.append('new_password',pass1);
            callApiChangePassowrd(param)
        }
    }

    function callApiChangePassowrd(param) {
        setIsFetching(true)
        apiChangePassword(param)
            .then(res => {
                constants.isGuestLogin=false
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                });
            })
            .catch(error => setTimeout(() => {
                alert(error)
            }, 200))
            .finally(() => setIsFetching(false));
    }


    return (
        <SafeAreaView style={styleApp.safeAreaRoot}>
            <View style={styleApp.container}>
                <Loader loading={isFetching} />
                <Header icon={images.cancel} titleLeft title="Set new password" />
                <View style={[styleApp.container, spacing.viewPadding]}>
                    <Text regular px18 black50>Make new password to continue</Text>

                    <View style={{ marginTop: dimens.h4, marginBottom: dimens.h2 }}>
                        <TextInputView style={styleApp.textInputPadding}
                            attrName='otp'
                            title='OTP'
                            headerTitle='OTP Code'
                            placeholder='OTP'
                            errorText='Please enter OTP.'
                            isError={isErrorOTP}
                            titleTextColor={colors.fontAb9a9d}
                            isBorder={true}
                            autoCapNone
                            maxLength={6}
                            number
                            actionNext
                            value={otp}
                            updateMasterState={(attr, value) => setOtp(value)} />
                    </View>


                    <View style={{ marginBottom: dimens.h2 }}>
                        <TextInputView style={styleApp.textInputPadding}
                            attrName='oldpass'
                            title='Enter Password'
                            headerTitle='Enter Password'
                            placeholder='Password'
                            errorText={strings.errorPassword}
                            isError={isErrorPass1}
                            titleTextColor={colors.fontAb9a9d}
                            isBorder={true}
                            autoCapNone
                            actionNext
                            secure
                            value={pass1}
                            updateMasterState={(attr, value) => setPass1(value)} />
                    </View>

                    <View style={{ marginBottom: dimens.h2 }}>
                        <TextInputView style={styleApp.textInputPadding}
                            attrName='repass'
                            title='Re-enter Password'
                            headerTitle='Re-enter Password'
                            placeholder='Password'
                            errorText='Password does not match.'
                            isError={isErrorPass2}
                            titleTextColor={colors.fontAb9a9d}
                            isBorder={true}
                            autoCapNone
                            secure
                            actionNext
                            value={pass2}
                            updateMasterState={(attr, value) => setPass2(value)} />
                    </View>

                    <Button style={[styleApp.buttonPadding]}
                        full
                        onPress={() => validate()}>
                        <Text white boldSemi px14 transform='uppercase'>UPDATE</Text>
                    </Button>
                </View>
            </View>
            {setBottomImage()}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    bottomImg: {
        position: 'absolute', bottom: 0
    }

})
