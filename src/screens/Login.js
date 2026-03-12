import React, { useState, useContext, useEffect } from 'react';
import {
  View, TouchableOpacity, Keyboard, Alert, StyleSheet, Linking,
  KeyboardAvoidingView, ScrollView, SafeAreaView, PermissionsAndroid,
  Image
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage'
import { Loader, Button, Text, TextInputView, ImageIcon, ImageFast, ScalableImage } from '../component'
import { constants, images, colors, styleApp, dimens, spacing, keys, strings } from '../constants'
import FacebookIntegrationClass from '../socialmedia/FacebookIntegration';
import GooglePlusIntegrationClass from '../socialmedia/GooglePlusIntegration';
import PermissionDialogModel from '../dialog/PermissionDialogModel';

import * as appAction from '../redux/actions/AppAction'
import { useDispatch, useSelector } from "react-redux";
import { connect } from 'react-redux';
import { checkPassword } from '../utils/Utils'

import { setClientToken } from '../utils/API'
import Geolocation from '@react-native-community/geolocation';
var isErrorEmail;
var isErrorPassword;
import { apiLogin } from '../redux/api'
import { EventEmitter } from '../utils/event'

import {
  appleAuth,
  AppleButton,
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
  AppleAuthCredentialState,
} from '@invertase/react-native-apple-authentication';

export default function Login({ navigation }) {

  const [emailId, setEmailId] = useState('')
  const [password, setPassword] = useState('')
  const [isReload, setIsReload] = useState(false)
  const [isPermissionVisible, setIsPermissionVisible] = useState(false)
  const [isFetching, setIsFetching] = useState(false);
  const [isGuestLogin, setIsGuest] = useState(constants.isGuestLogin)

  useEffect(() => {
    isErrorEmail = false;
    isErrorPassword = false;
    GooglePlusIntegrationClass.getInstance().initializeGooglePlusSdk();

    if (constants.isAndroid) checkPermissionGranted();
    setTimeout(() => {
      checkLocationPermission(true)

      // test();
    }, 1000);

    return () => {
      console.log('COMPONENT  unmount');
    }
  }, []);


  async function checkPermissionGranted() {
    const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    if (!granted) {
      // setIsPermissionVisible(true)
    }
  }


  function validate() {
    Keyboard.dismiss();
    isErrorEmail = (!emailId || emailId.length <= 0);
    isErrorEmail = !validateEmail(emailId)
    isErrorPassword = (!password || password.length <= 0);
    isErrorPassword = !checkPassword(password)
    console.log('isErrorPassword ', isErrorPassword)
    if (isErrorEmail || isErrorPassword) {
      setIsReload(!isReload)
      return;
    }

    var bodyFormData = {}
    bodyFormData["email"] = emailId
    bodyFormData["password"] = password
    bodyFormData["device_token"] = 'token'
    bodyFormData["device_type"] = constants.deviceType
    bodyFormData["google_id"] = ""
    bodyFormData["facebook_id"] = ""

    // var bodyFormData = new FormData();
    // bodyFormData.append('email', emailId);
    // bodyFormData.append('password', password);
    // bodyFormData.append('device_token', 'token');
    // bodyFormData.append('device_type', constants.deviceType);
    // bodyFormData.append('google_id', '')
    // bodyFormData.append('facebook_id', '')
    callApiLogin(bodyFormData)
  }

  function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  function callApiLogin(bodyFormData) {
    setIsFetching(true)
    // var dict = {
    //   'email': emailId,
    //   'password': password,
    //   'device_token': 'token',
    //   'device_type': constants.deviceType
    // }
    apiLogin(bodyFormData)
      .then(res => {
        console.log("callApiLogin res :  ",res)
        if(res){
          GoToHome(res)
        }
      })
      .catch(error => setTimeout(() => {
        alert(error)
      }, 200))
      .finally(() => setIsFetching(false));
  }

  function GoToHome(data) {
    console.log("data : ",data)
    AsyncStorage.setItem(keys.token, JSON.stringify(data.token)).then(() => {
      AsyncStorage.setItem(keys.userId, data.data.id + '').then(() => {
        AsyncStorage.setItem(keys.user, JSON.stringify(data.data)).then(() => {
          AsyncStorage.setItem('isLoggedIn', '1').then(() => {
            setClientToken(JSON.stringify(data.token))
            if (isGuestLogin) {
              AsyncStorage.setItem('isGuest', '0').then(() => {
                dispatchGuestEvent(true)
              });
            } else {
              navigation.reset({
                index: 0,
                routes: [{ name: 'TabStack' }],
              });
            }
          });
        });
      });
    });
  }
  function validateSocial(name, email, id, type) {
    Keyboard.dismiss();
    var bodyFormData = {}
    bodyFormData["name"] = name
    bodyFormData["email"] = email ? email : ''
    bodyFormData["password"] = ''
    bodyFormData["device_token"] = 'token'
    bodyFormData["device_type"] = constants.deviceType
    bodyFormData["google_id"] = type == 1 ? id : ''
    bodyFormData["facebook_id"] = type == 2 ? id : ''


    // var bodyFormData = new FormData();
    // bodyFormData.append('name', name)
    // bodyFormData.append('email', email ? email : '');
    // bodyFormData.append('password', '');
    // bodyFormData.append('device_token', 'token');
    // bodyFormData.append('device_type', constants.deviceType);
    // bodyFormData.append('google_id', type == 1 ? id : '')
    // bodyFormData.append('facebook_id', type == 2 ? id : '')
    console.log('REQ SOICAL : ', JSON.stringify(bodyFormData))
    callApiLogin(bodyFormData)
  }

  // Login with apple
  async function loginApple() {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      // Note: it appears putting FULL_NAME first is important, see issue #293
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });
    // const appleAuthRequestResponse = await appleAuth.performRequest({
    //   requestedOperation: AppleAuthRequestOperation.LOGIN,
    //   requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
    // });
    // const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

    const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);


    // if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
      if (credentialState === appleAuth.State.AUTHORIZED) {
      Keyboard.dismiss();
      var bodyFormData = {}
      bodyFormData["name"] = appleAuthRequestResponse.user
      bodyFormData["device_token"] = 'token'
      bodyFormData["device_type"] = constants.deviceType
      bodyFormData["apple_id"] = appleAuthRequestResponse.authorizationCode


      // var bodyFormData = new FormData();
      // bodyFormData.append('name', appleAuthRequestResponse.user)
      // bodyFormData.append('device_token', 'token');
      // bodyFormData.append('device_type', constants.deviceType);
      // bodyFormData.append('apple_id', appleAuthRequestResponse.authorizationCode)
      console.log('REQ SOICAL APPLE : ', JSON.stringify(bodyFormData))
      callApiLogin(bodyFormData)
    }else{
      Alert.alert('Auth', 'Could not authenticate you');
    }
  }

  // This Method Use Handle Login With Facebook Click Event
  function loginFacebook() {
    FacebookIntegrationClass.getInstance().loginWithFacebook((cb, type) => {
      console.log(cb)
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

  async function checkLocationPermission(isAllow) {
    setIsPermissionVisible(false)
    if (!isAllow) return
    if (!constants.isAndroid) {
      Geolocation.requestAuthorization()
      var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };
      Geolocation.getCurrentPosition(successCallback, errorCallback, options);
    } else {
      let androidGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      if (androidGranted === PermissionsAndroid.RESULTS.GRANTED) {
        //his.getGeoLocation();
      } else {
        console.log('Location permission not granted!!!!');
      }
    }
  }
  function successCallback(geo) {
    console.log('gep ', geo)
  }
  function errorCallback(error) {
    if (error.code == error.PERMISSION_DENIED) {
      Linking.openURL('app-settings:')
    }
  }

  function guestLogin() {
    AsyncStorage.setItem('isGuest', '2').then(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'TabStack' }],
      });
    });
  }

  function dispatchGuestEvent(isLogin) {
    EventEmitter.dispatch('GuestLoginACtion', isLogin)
  }
  return (
    <SafeAreaView style={[styleApp.safeAreaRoot, { alignItems: 'center' }]}>
      <Loader loading={isFetching} />
      {!isGuestLogin ?
        <TouchableOpacity onPress={() => guestLogin()}
          style={{ position: 'absolute', right: 0, padding: dimens.w5 ,marginTop: dimens.w8}}>
          <Text px18 bold  >SKIP</Text>
        </TouchableOpacity> : null
      }

      {!isGuestLogin ?
        <ImageFast
          contain
          style={{ width: dimens.w30, height: dimens.w30 }}
          source={images.splashIcon} /> :
        <View style={{
          padding: dimens.w5, flexDirection: 'row',
          paddingHorizontal: dimens.w5, marginBottom: dimens.w2
        }}>
          <View style={{ flex: 1, }}>
            <Text px22 bold>Almost there!</Text>
            <Text px14 grayLight>Login hunting meals quickly</Text>
          </View>
          <TouchableOpacity onPress={() => dispatchGuestEvent(false)}
            hitSlop={{top:10, left :10, right:10, bottom:10}}>
          <Image style={{width:15, height : 15, resizeMode : 'contain'}} source={images.closeGray}
            />
            </TouchableOpacity>
          {/* <ImageIcon path={images.closeGray}
            onClick={() => dispatchGuestEvent(false)} /> */}

        </View>
      }

      <PermissionDialogModel visible={isPermissionVisible}
        onClick={(isAllow) => {
          checkLocationPermission(isAllow);
        }}
      />
      <KeyboardAvoidingView style={{ paddingBottom: isGuestLogin ? dimens.w2 : dimens.h20, flex: 1, width: '100%' }}
        behavior={!constants.isAndroid ? 'padding' : null}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1 }}>

            <View style={[spacing.viewPaddingHorizontal, spacing.container]}>
              <View>
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
                  autoCapNone
                  actionNext
                  value={emailId}
                  updateMasterState={(a, b) => setEmailId(b)} />
              </View>
              <View style={{ marginTop: dimens.h1 }}>
                <TextInputView style={[styleApp.textInputPadding]}
                  attrName='password'
                  title='PASSWORD'
                  headerTitle='Password'
                  placeholder='Password'
                  errorText={strings.errorPassLogin}
                  isError={isErrorPassword}
                  titleTextColor={colors.fontAb9a9d}
                  isBorder={true}
                  secure
                  value={password}
                  updateMasterState={(a, b) => setPassword(b)} />
                <TouchableOpacity onPress={() => isGuestLogin ? EventEmitter.dispatch('onFOrgotPassword', true)
                  : navigation.navigate('ForgotPassword')}>
                  <Text style={{ marginVertical: dimens.h2 }} align='right'
                    primary px14 bold underline>Forgot Password?</Text></TouchableOpacity>
                <Button style={[styleApp.buttonPadding]}
                  full
                  onPress={() => validate(false, '', '')}>
                  <Text white boldSemi px14 transform='uppercase'>Sign In</Text>
                </Button>
              </View>
              <Text center grayLight boldSemi px18 style={{ marginVertical: dimens.h1 }}>OR CONNECT WITH</Text>
              {constants.isAndroid ?
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
                </View>
                :
                <View style={{ flexDirection: 'row', justifyContent: 'center' }} >
                  <ImageIcon touchableStyle={styles.socialIconOnly} path={images.apple}
                    onClick={() => loginApple()} />
                  <ImageIcon touchableStyle={[styles.socialIconOnly,
                  { marginHorizontal: dimens.w6 }]}
                    path={images.fb}
                    onClick={() => loginFacebook()} />
                  <ImageIcon touchableStyle={styles.socialIconOnly} path={images.google}
                    onClick={() => loginGooglePlus()} />
                </View>
              }
              <View style={styles.noMember}>
                <Text grayLight boldSemi px16>Not a member.</Text>
                <TouchableOpacity
                  style={{ paddingVertical: dimens.w1 }}
                  onPress={() => {
                    isGuestLogin ? EventEmitter.dispatch('onSignUP', true)
                      : navigation.navigate('Register')
                  }}>
                  <Text style={{ marginLeft: 5 }} primary px14 bold underline>Sign up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {!isGuestLogin ? setBottomImage() : null}

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

  bottomImg: {
    position: 'absolute', bottom: 0, marginTop: -dimens.w5
  },
  socialIcon: {
    borderColor: colors.borderColor, borderWidth: 1, alignItems: 'center',
    justifyContent: 'center', flex: 1, borderRadius: dimens.w1, padding: dimens.w3
  },
  socialIconOnly: {
    width: 50,
    height: 50,
    borderRadius: dimens.w1, justifyContent: 'center',
    borderColor: colors.black, borderWidth: 1, alignItems: 'center',
  }

})
