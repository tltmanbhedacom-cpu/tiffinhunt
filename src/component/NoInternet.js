import React, { useContext, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { dimens, styleApp, spacing, constants, images } from "../constants";
import { Text, ImageFast, Button } from '../component'

{/* <NoInternet onTryAgain={()=>console.log('ok')}/> */}


export default function NoInternet(props) {
    return ( <View style={{ flex: 1 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ImageFast
                contain
                style={{ width: dimens.w45, height: dimens.w45 }}
                source={images.nointernet} />

            <Text px22 black bold transform='uppercase' center
                style={{ marginTop: dimens.w3, paddingHorizontal: dimens.w5 }} >WHOOPS! NOT YOUR FAULT</Text>
            <Text px16 black50 regular center style={styles.txt2} >You just don't have an internet connection</Text>
        </View>
        {/** Go Back Button */}
        <View style={spacing.viewPadding}>
                <Button full style={styles.goBackBtn}
                    onPress={() => props.onTryAgain()}>
                    <Text transform='uppercase' boldSemi white >TRY AGAIN</Text>
                </Button>
            </View>
    </View>)
}

const styles = StyleSheet.create({
    txt2: {
        marginTop: dimens.w2, paddingHorizontal: dimens.w5
    },
    goBackBtn:
    {
        paddingVertical: constants.btnPaddingVertical,
    },
});
