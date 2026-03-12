import React, { useEffect, useState, useRef, Component } from "react";
import { TouchableOpacity, Dimensions, SafeAreaView, StyleSheet, Image, View, FlatList, Platform, Alert } from 'react-native';
import { Loader, Button, Text, TextInputView, ImageIcon, ImageFast, Header } from '../component'
import { constants, images, colors, styleApp, dimens, spacing } from '../constants'
import { useDispatch, useSelector } from 'react-redux';
import RBSheet from "react-native-raw-bottom-sheet";
import Login from './Login'
import { EventEmitter } from '../utils/event'


export default function GuestLogin(props) {

    const loginRef = useRef();

    useEffect(() => {
        constants.isGuestLogin = true
        try {
            EventEmitter.subscribe('GuestLoginACtion', (event) => {
                console.log('EVKSDs :: ', event)
                constants.isGuestLogin = false
                try {
                    props.onFinish(event)
                    loginRef.current.close()
                } catch (error) {

                }
            })

            EventEmitter.subscribe('onSignUP', (event) => {
                try {
                    props.onFinish(event)
                    loginRef.current.close()
                } catch (error) {

                }
                onSignUp()
            })
            EventEmitter.subscribe('onFOrgotPassword', (event) => {
                try {
                    props.onFinish(event)
                    loginRef.current.close()
                } catch (error) {

                }
                onForgotPassword()
            })
        } catch (error) {

        }
        loginRef.current.open()
        return () => {

        }
    }, [props.isShow]);

    function onLoginAction(isDone) {
        loginRef.current.close()
    }

    function onSignUp() {
        props.navigation.navigate('Auth', {
            screen: 'Register',
            params: { isGuestLogin: true }
        })
    }
    function onForgotPassword() {
        props.navigation.navigate('Auth', {
            screen: 'ForgotPassword',
            params: { isGuestLogin: true }
        })
    }
    return (
        <SafeAreaView style={styleApp.safeAreaRoot}>
            <View

            >
                <RBSheet
                    ref={loginRef}
                    height={dimens.h70}
                    customStyles={{
                        container: {
                            borderTopRightRadius: dimens.w5,
                            borderTopLeftRadius: dimens.w5
                        }
                    }}
                >
                    <Login isFromGuest={true} onLoginAction={onLoginAction} />
                </RBSheet>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

});
