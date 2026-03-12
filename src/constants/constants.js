/**
* @providesModule Constants
*/
import { Dimensions, Platform } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils/ResponsiveScreen';
import { dimens } from './dimens';


export let constants = {
    user_id :0,
    isGuestLogin :false,
    currency : "$",
    marginTopHeader : dimens.w2,
    marginBottonNotch : dimens.h4,
    headerIconMarginStart : -dimens.w2o5,
    marginH : dimens.w6,
    marginV : dimens.w3,
    borderRadius : dimens.w2,
    btnPaddingVertical : dimens.w3,
    bullet : '\u2022',
    borderWidth :0.5,
    viewPadding : dimens.w4,
    viewPaddingH: dimens.w4, // Horizontal padding left and right
    viewPaddingV: dimens.w4, //Vertical padding top and bottom
    defaultMargin: dimens.w3,
    screenHeight: Dimensions.get('window').height,
    screenWidth: Dimensions.get('window').width,
    divider: { backgroundColor: '#D6D6D6' },
    isAndroid: Platform.OS == 'android',
    deviceType: Platform.OS == 'android' ? 'Android' : 'IOS',
    //Static Messages
    apiError: 'Opps! Something went wrong.Please try again',
    //Preference key
    prefSetting: 'prefSetting',
    googleKey : Platform.OS == 'ios' ? 'AIzaSyBvM4RLX9ENQOAZxnhZCeYnGi496SXvLkI' : "AIzaSyAd-oNekkwJde_oF0Piu7wkrQVBk31-8YM"
};

