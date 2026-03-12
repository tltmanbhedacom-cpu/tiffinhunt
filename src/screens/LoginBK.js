import React, { useState, useContext, useEffect } from 'react';
import {
  View, TouchableOpacity, Keyboard, Alert, StyleSheet, Linking,
  KeyboardAvoidingView, ScrollView, SafeAreaView, PermissionsAndroid
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

class Login extends React.Component {
  constructor(props) {
    super(props)

    console.log(this.props.navigation)
    isErrorEmail = false;
    isErrorPassword = false;


    this.state = {
      useremailid: '',
      userpassword: '',
      emailId: '',
      password: '',
      isReload: false,
      isPermissionVisible: false,
    }
    if (constants.isAndroid) this.checkPermissionGranted();
    setTimeout(() => {
      this.checkLocationPermission(true)
    }, 1000);
  }

  checkPermissionGranted = async () => {
    const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    if (!granted) {
      this.setState({ isPermissionVisible: true })
    }

  }
  componentDidMount() {
    GooglePlusIntegrationClass.getInstance().initializeGooglePlusSdk();
  }

  goToHome = (data) => {
    console.log(data)
    AsyncStorage.setItem(keys.token, JSON.stringify(this.props.data.token)).then(() => {
      AsyncStorage.setItem(keys.userId, this.props.data.data.id + '').then(() => {
        AsyncStorage.setItem(keys.user, JSON.stringify(this.props.data.data)).then(() => {
          AsyncStorage.setItem('isLoggedIn', '1').then(() => {
            setClientToken(JSON.stringify(this.props.data.token))
            // this.props.navigation.reset({
            //   index: 0,
            //   routes: [{ name: 'TabStack' }],
            // });
            this.props.navigation.navigate('TabStack')
          });
        });
      });
    });
  }

  validate = () => {
    Keyboard.dismiss();
    var emailId = this.state.emailId;
    var password = this.state.password;
    isErrorEmail = (!emailId || emailId.length <= 0);
    isErrorEmail = !this.validateEmail(emailId)
    isErrorPassword = (!password || password.length <= 0);
    isErrorPassword = !checkPassword(password)
    console.log('isErrorPassword ', isErrorPassword)
    if (isErrorEmail || isErrorPassword) {
      this.setState({ isReload: !this.state.isReload })
      return;
    }
    var bodyFormData = {}
    bodyFormData["email"] = emailId;
    bodyFormData["password"] = password;
    bodyFormData["device_token"] = 'dummy';
    bodyFormData["device_type"] = constants.deviceType;
    bodyFormData["google_id"] = '';
    bodyFormData["facebook_id"] = '';


    // var bodyFormData = new FormData();
    // bodyFormData.append('email', emailId);
    // bodyFormData.append('password', password);
    // bodyFormData.append('device_token', 'dummy');
    // bodyFormData.append('device_type', constants.deviceType);
    // bodyFormData.append('google_id', '')
    // bodyFormData.append('facebook_id', '')
    this.props.login(bodyFormData)
      .then(() => {
        if (this.props.message) {
          setTimeout(() => {
            Alert.alert('Alert', this.props.message);
          }, 200)
        } else {
          console.log("resp : " + JSON.stringify(this.props.data));
          this.goToHome(this.props.data)
        }
      })
  }

  validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  validateSocial = (name, email, id, type) => {
    Keyboard.dismiss();

    var bodyFormData = {}
    bodyFormData["name"] = name;
    bodyFormData["email"] = email?email:'';
    bodyFormData["password"] = "";
    bodyFormData["device_token"] = 'dummy';
    bodyFormData["device_type"] =  constants.deviceType;
    bodyFormData["google_id"] = type == 1 ? id : '';
    bodyFormData["facebook_id"] = type == 2 ? id : '';



    // var bodyFormData = new FormData();
    // bodyFormData.append('name', name)
    // bodyFormData.append('email', email?email:'');
    // bodyFormData.append('password', '');
    // bodyFormData.append('device_token', 'dummy');
    // bodyFormData.append('device_type', constants.deviceType);
    // bodyFormData.append('google_id', type == 1 ? id : '')
    // bodyFormData.append('facebook_id', type == 2 ? id : '')
    console.log('REQ SOICAL BK : ', JSON.stringify(bodyFormData))
    this.props.login(bodyFormData)
      .then(() => {
        if (this.props.message) {
          setTimeout(() => {
            Alert.alert('Alert', this.props.message);
            //
          }, 200)
        } else {
          console.log("resp : " + JSON.stringify(this.props.data.token));
          this.goToHome(this.props.data)

        }
      })
  }


  // This Method Use Handle Login With Facebook Click Event
  loginFacebook() {
    FacebookIntegrationClass.getInstance().loginWithFacebook((cb, type) => {
      console.log(cb)
      if (type == 1) {
        var userInfo = cb;
        this.validateSocial(userInfo.name, userInfo.email, userInfo.id, 2)
        // Alert.alert('user name :' + JSON.stringify(userInfo));
      }
      else {
        Alert.alert(cb)
      }
    });
  }

  // This Method Use Handle Login With Google Plus Click Event
  loginGooglePlus() {
    GooglePlusIntegrationClass.getInstance().loginWithGooglePlus((cb, type) => {
      if (type == 1) {
        var userInfo = cb;
        // Alert.alert('user name :' + JSON.stringify(userInfo));
        this.validateSocial(userInfo.name, userInfo.email, userInfo.id, 1)
      }
      else {
        Alert.alert(cb)
      }
    });
  }

  setBottomImage() {
    return (
      <View style={styles.bottomImg}>
        <ScalableImage
          width={constants.screenWidth}
          source={images.bottomHalf} />

      </View>
    )
  }

  nextTextField = (id) => {
    //  this.inputs[id].current.focus();
  }

  checkLocationPermission = async (isAllow) => {
    this.setState({ isPermissionVisible: false })
    if (!isAllow) return
    if (!constants.isAndroid) {
      Geolocation.requestAuthorization()
      var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };
      Geolocation.getCurrentPosition(this.successCallback, this.errorCallback, options);
    } else {
      let androidGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      if (androidGranted === PermissionsAndroid.RESULTS.GRANTED) {
        //his.getGeoLocation();
      } else {
        console.log('Location permission not granted!!!!');
      }
    }
  }
  successCallback = (geo) => {
    console.log('gep ', geo)
  }
  errorCallback = (error) => {
    if (error.code == error.PERMISSION_DENIED) {
      Linking.openURL('app-settings:')
    }
  }
  render() {
    return (
      <SafeAreaView style={[styleApp.safeAreaRoot, { alignItems: 'center' }]}>
        <Loader loading={this.props.isLoading} />
        <ImageFast
          contain
          style={{ width: dimens.w30, height: dimens.w30 }}
          source={images.splashIcon} />
        <PermissionDialogModel visible={this.state.isPermissionVisible}
          onClick={(isAllow) => {
            this.checkLocationPermission(isAllow);
          }}
        />
        <KeyboardAvoidingView style={{ paddingBottom: dimens.h20, flex: 1, width: '100%' }}
          behavior={!constants.isAndroid ? 'padding' : null}>
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}>
            <View style={{ flex: 1 }}>
              <View style={[spacing.viewPaddingHorizontal, spacing.container]}>
                <View>
                  <TextInputView style={styleApp.textInputPadding}
                    ref='email'
                    attrName='emailId'
                    title='EMAILID'
                    headerTitle='Email ID'
                    placeholder='Emailid'
                    errorText='Please enter valid email id.'
                    isError={isErrorEmail}
                    titleTextColor={colors.fontAb9a9d}
                    isBorder={true}
                    email
                    autoCapNone
                    actionNext
                    value={this.state.emailId}
                    onSubmitEditing={() => this.nextTextField('pass')}
                    updateMasterState={this._updateMasterState} />
                </View>
                <View style={{ marginTop: dimens.h1 }}>
                  <TextInputView style={[styleApp.textInputPadding]}
                    ref='pass'
                    attrName='password'
                    title='PASSWORD'
                    headerTitle='Password'
                    placeholder='Password'
                    errorText={strings.errorPassLogin}
                    isError={isErrorPassword}
                    titleTextColor={colors.fontAb9a9d}
                    isBorder={true}
                    secure
                    value={this.state.password}
                    updateMasterState={this._updateMasterState} />
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPassword')}>
                    <Text style={{ marginVertical: dimens.h2 }} align='right'
                      primary px14 bold underline>Forgot Password?</Text></TouchableOpacity>
                  <Button style={[styleApp.buttonPadding]}
                    full
                    onPress={() => this.validate(false, '', '')}>
                    <Text white boldSemi px14 transform='uppercase'>Sign In</Text>
                  </Button>
                </View>
                <Text center grayLight boldSemi px18 style={{ marginVertical: dimens.h1 }}>or</Text>
                <View style={{ flexDirection: 'row', }} >
                  <Button
                    style={{ flex: 1 }}
                    onPress={() => this.loginGooglePlus()}
                    outline iconLeft={images.google}>
                    <Text center black px14 regular>Google</Text>
                  </Button>
                  <Button
                    style={{ flex: 1, marginStart: dimens.w6 }}
                    onPress={() => this.loginFacebook()}
                    outline iconLeft={images.fb}>
                    <Text center black px14 regular>Facebook</Text>
                  </Button>
                </View>
                <View style={styles.noMember}>
                  <Text grayLight boldSemi px16>Not a member.</Text>
                  <TouchableOpacity
                    style={{ paddingVertical: dimens.w1 }}
                    onPress={() => { this.props.navigation.navigate('Register') }}>
                    <Text style={{ marginLeft: 5 }} primary px14 bold underline>Sign up</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        {this.setBottomImage()}
      </SafeAreaView>
    );
  }

  _updateMasterState = (attrName, value) => {
    this.setState({ [attrName]: value });
  }

}

const styles = StyleSheet.create({
  noMember: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: dimens.h2,
    alignItems: 'center'

  },

  bottomImg: {
    position: 'absolute', bottom: 0
  }

})

function mapStateToProps(state) {
  return {
    isLoading: state.appReducer.isLoading,
    data: state.appReducer.data,
    message: state.appReducer.message
  }
}

const mapDispatchToProps = dispatch => ({
  login: (request) => dispatch(appAction.login(request))
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
