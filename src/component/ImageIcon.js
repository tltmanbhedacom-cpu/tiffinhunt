import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { dimens, styleApp } from "../constants";
// import FastImage from 'react-native-fast-image'
{/* <ImageIcon
touchableStyle={{ position: 'absolute' }}
style={{ marginStart: dimens.w3 }}
path={require('../images/back.png')}
onClick={() => navigation.goBack()} />


For SHow Only Icon
--------------
<ImageIcon path={images.vegGreen}/>


BIG icon 
---------
<ImageIcon big path={images.back}
                        onClick={() => console.log('icon click')} />
                        
Example -2

  <ImageIcon
          touchableStyle={{}}
            style={{ }}
            path={images.starYellow}
            onClick={() => console.log('icon click')} />

*/}

export default function ImageIcon(props) {
    return (<TouchableOpacity
        disabled={!(props.onClick)}
        style={[styleApp.iconPadding, props.touchableStyle]}
        onPress={() => props.onClick()}>
        {/* <Image
            style={[props.big ? styleApp.iconBig: styleApp.icon, props.style]}
            source={props.url
                ? { uri: props.url }
                : props.path} /> */}
                <Image 
                style={[props.big ? styleApp.iconBig: styleApp.icon,,{resizeMode :"contain" }, props.style]} {...props}
                source={props.url
                    ? { uri: props.url }
                    : props.path}
                />
        {/* <FastImage  style={[props.big ? styleApp.iconBig: styleApp.icon, props.style]} {...props}
            source={props.url
                ? { uri: props.url }
                : props.path}
            resizeMode={FastImage.resizeMode.contain}
            onError={() => console.log('image error in load image : ImageFast.js')}>
        </FastImage> */}
    </TouchableOpacity>);
}

const styles = StyleSheet.create({

});
