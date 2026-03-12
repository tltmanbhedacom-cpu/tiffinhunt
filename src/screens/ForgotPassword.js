import React, { useEffect, useState } from "react";
import {
    TouchableOpacity, Dimensions, SafeAreaView,
    StyleSheet, Image, View, FlatList, Platform, Alert
} from 'react-native';
import { Loader, Button, Text, TextInputView, ImageIcon, ScalableImage, Header } from '../component'
import { constants, images, colors, styleApp, dimens, spacing } from '../constants'
import { useDispatch, useSelector } from 'react-redux';
import { apiForgotPassword } from '../redux/api'

var isErrorEmail = false;
export default function ForgotPassword({ route, navigation }) {
    const dispatch = useDispatch();
    const [isFetching, setIsFetching] = useState(false);
    const [email, setEmailId] = useState('')
    const [reload, setReload] = useState(true)
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
        console.log(email.length)
        if (email.length > 0 && validateEmail(email)) {
            isErrorEmail = false;
            callApiForgorPassowrd()
        } else {
            isErrorEmail = true;
        }
        console.log('isErrorEmail  ', isErrorEmail)
        setReload(!reload)

    }

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    function callApiForgorPassowrd() {
        setIsFetching(true)
        var param = {}
        param["email"] = email

        // const param = new FormData()
        // param.append('email', email);
        apiForgotPassword(param)
            .then(res => {
                navigation.push('ChangePassword', { isGuestLogin: route.params.isGuestLogin });
            })
            .catch(error => alert(error))
            .finally(() => setIsFetching(false));
    }

    return (
        <SafeAreaView style={styleApp.container}>
            <View style={styleApp.container}>
                <Loader loading={isFetching} />
                <Header icon={images.cancel} titleLeft title="Forgot Password?" />
                <View style={[styleApp.container, spacing.viewPadding]}>
                    <Text regular px18 black50>Enter your registered e-mail we'll send you OTP to reset your password.</Text>

                    <View style={{ marginTop: dimens.h4, marginBottom: dimens.h2 }}>
                        <TextInputView style={styleApp.textInputPadding}
                            attrName='emailId'
                            title='Email ID'
                            headerTitle='Email ID'
                            placeholder='abc@email.com'
                            errorText='Please enter valid email id.'
                            isError={isErrorEmail}
                            titleTextColor={colors.fontAb9a9d}
                            isBorder={true}
                            email
                            autoCapNone
                            actionNext
                            value={email}
                            updateMasterState={(attr, value) => setEmailId(value)} />
                    </View>

                    <Button style={[styleApp.buttonPadding]}
                        full
                        onPress={() => validate()}>
                        <Text white boldSemi px14 transform='uppercase'>Next</Text>
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
