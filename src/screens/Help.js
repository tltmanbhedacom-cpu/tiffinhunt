import React, { useEffect, useState } from "react";
import {
    TouchableOpacity, TouchableWithoutFeedback, SafeAreaView, StyleSheet,
    View, Linking,ScrollView
} from 'react-native';
import { Loader, Button, Text, TextInputView, ImageIcon, ImageFast, Header, DividerH } from '../component'
import { constants, images, colors, styleApp, dimens, spacing, strings } from '../constants'
import { useDispatch, useSelector } from 'react-redux';
import { orderHelp, } from '../redux/api'
import { useSafeArea } from 'react-native-safe-area-context';


var helpAry = ['Money withdrown but order pending?',
    'Any refund query?',
    'Issue while placing order?',
    'Want to skip/pause meal?',
    'Want to change subscription?']

var order_id = 0;
export default function Help({ route, navigation }) {
    const dispatch = useDispatch();
    const [isFetching, setIsFetching] = useState(false);
    const [options, setOption] = useState(0)
    const [userQuery ,setUserQuery] =useState('')
    const insets = useSafeArea();

    useEffect(() => {
        order_id = 0;
        console.log('route.params ', route.params);
        if (route.params != null) {
            order_id = route.params.orderId
        }
        return () => {
            order_id = 0;
        }
    }, []);

    function HelpQuestion({ que, selectedNo }) {
        return (
            <TouchableWithoutFeedback onPress={() => setOption(selectedNo)}>
                <View style={{ flexDirection: 'row', marginBottom: dimens.w2o5 }}>
                    <Text px16 medium flex1>{que}</Text>
                    <ImageIcon path={options == selectedNo ? images.radio : images.radioblank} />
                </View>
            </TouchableWithoutFeedback>
        )
    }

    function openWeb(title, link) {
        navigation.navigate('WebViews', { title: title, url: link })
    }

    function openEmail() {
        var emailLink = 'mailto:<' + strings.helpEmail + '>?subject=&body='
        Linking.openURL(emailLink);
    }
    function openPhoneDial() {
        let callOn = '${' + strings.helpMobile + '}'
        let phoneNumber = '';
        if (constants.isAndroid) {
            phoneNumber = 'tel:' + callOn;
        }
        else {
            phoneNumber = 'telprompt:' + callOn;
        }

        Linking.openURL(phoneNumber);
    }
    function submiHelp() {
        if (options <= 0) {
            alert('Please select help.')
            return
        }
        var param = {}
        param["order_id"]= order_id
        param["subject"]= helpAry[options - 1]
        param["type"]= options
        param["user_comment"]= userQuery


        // var param =new FormData();
        // param.append('order_id',order_id)
        // param.append('subject',helpAry[options - 1])
        // param.append('type',options)
        // param.append('user_comment',userQuery)
        console.log(param)
        setIsFetching(true)
        orderHelp(param)
            .then(res => {
               setTimeout(() => {
                alert(res)
               }, 500);
                navigation.goBack();
            })
            .catch(error => setTimeout(() => {
                alert(error)
            }, 500))
            .finally(() => { setIsFetching(false) });
    }
    return (
        // <SafeAreaView style={styleApp.safeAreaRoot} >
        <View style={[styleApp.container, { paddingTop: insets.top, }]}>
            <Loader loading={isFetching} />
            <Header titleLeft title="Help" />
            <ScrollView>
            <View style={[styleApp.container, spacing.viewPaddingHorizontal]}>
                <Text boldSemi px20 style={{ marginBottom: dimens.w1 }}>Payments</Text>
                <HelpQuestion que={helpAry[0]} selectedNo={1} />
                <HelpQuestion que={helpAry[1]} selectedNo={2} />
                <View style={styles.divider} />
                <Text boldSemi px20 style={{ marginBottom: dimens.w1 }}>Orders</Text>
                <HelpQuestion que={helpAry[2]} selectedNo={3} />
                <HelpQuestion que={helpAry[3]} selectedNo={4} />
                <HelpQuestion que={helpAry[4]} selectedNo={5} />
                <View style={styles.divider} />
                <View style={{marginBottom :dimens.w3}}>
                    <TextInputView
                        attrName='coment'
                        headerTitle='Do you have any comments?'
                        placeholder='Write your reviews here...'
                        autoCapitalize="none"
                        actionNext
                        maxLength={60}
                        multiline={true}
                        errorText=''
                        isError={false}
                        titleTextColor={colors.fontAb9a9d}
                        isBorder={true}
                        value={userQuery}
                        updateMasterState={(attr, value) => {
                            setUserQuery(value)
                        }}
                    />
                </View>
                <Text boldSemi px20 style={{ marginBottom: dimens.w1 }}>Legal,Terms & Conditions</Text>
                <TouchableOpacity
                    style={{ marginTop: dimens.w1 }}
                    onPress={() => openWeb(strings.PrivacyPolicy, strings.urlPrivacy)}>
                    <Text px16 medium >{strings.PrivacyPolicy}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ marginVertical: dimens.w2 }}
                    onPress={() => openWeb(strings.CancellationsRefund, strings.urlTermsPayment)}>
                    <Text px16 medium >{strings.CancellationsRefund}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => openWeb(strings.TermsUse, strings.urlTermsService)}>
                    <Text px16 medium >{strings.TermsUse}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ marginVertical: dimens.w2 }}
                    onPress={() => openWeb(strings.accountSecurity, strings.urlAccountSecurity)}>
                    <Text px16 medium >{strings.accountSecurity}</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>
            {/** Bottom */}
            <View style={[styleApp.shadows, { padding: dimens.w4, paddingBottom: insets.bottom, }]}>
                {/**Phonr */}
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <ImageIcon path={images.WorkPhone} />
                    <Text px16 bold flex1 style={{ marginStart: dimens.w3 }}>Want to call us?</Text>
                    <TouchableOpacity onPress={() => openPhoneDial()}>
                        <Text px14 bold primary underline>CALLNOW</Text>
                    </TouchableOpacity>

                </View>
                <Text px14 regular black50 style={{ marginVertical: dimens.w1o3 }}>Drop a mail to inquire your order & payment</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Text px14 regular black50>here : </Text>
                    <TouchableOpacity onPress={() => openEmail()}>
                        <Text px14 bold primary>{strings.helpEmail}</Text>
                    </TouchableOpacity>
                </View>
                <Button onPress={() => submiHelp()}>
                    <Text white boldSemi px14>SUBMIT</Text>
                </Button>
            </View>
        </View>
        // </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    divider: {
        width: '100%', height: 0.5, backgroundColor: colors.divider, marginVertical: dimens.w2
    }
});
