import React, { useEffect, useState } from "react";
import { SafeAreaView,StyleSheet, BackHandler, View,  } from 'react-native';
import { Loader, Button, Text, TextInputView, ImageIcon, ImageFast, Header } from '../component'
import { constants, images, colors, styleApp, dimens, spacing, fontSize, font } from '../constants'
import { useDispatch, useSelector } from 'react-redux';

function OrderSuccess({ route, navigation }) {
    const dispatch = useDispatch();
    const [isFetching, setIsFetching] = useState(false);
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => {
            console.log('COMPONENT  unmount');
            BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }
    }, []);

    function onBackPress() {
        navigation.popToTop()
        return true;
    }

    return (
        <SafeAreaView style={styleApp.safeAreaRoot}>
            <View style={[styleApp.container, spacing.viewPadding, { alignItems: 'center' }]}>
                <ImageIcon path={images.closeGray}
                touchableStyle={{position : 'absolute' ,right :0,padding :dimens.w5}}
                    onClick={() => navigation.popToTop()} />

                <Text primary style={{
                    fontSize: fontSize.FONT_40Px,
                    marginTop: dimens.w10,
                    fontFamily : font.BalooBhainaRegular
                }}>Thank you!</Text>

                <Text center black boldSemi px20 style={{ marginTop: dimens.w5, marginHorizontal: dimens.w15 }}
                >Your tiffin order placed successfully.</Text>

                <View style={{ flex: 1 ,justifyContent:'center' }}>
                    <ImageFast
                        style={{ width: dimens.w70, height: dimens.w70, }}
                        contain
                        source={images.orderPlaced} />
                </View>
                <Button full style={styles.goBackBtn}
                    onPress={() => {
                        navigation.popToTop()
                        navigation.push('MyTiffinPlan')
                    }}>
                    <Text transform='uppercase' boldSemi white px14>View Order Details</Text>
                </Button>
                <Text px18 medium style={{marginVertical :dimens.w2}}>Stay Relexed!</Text>
                <Text px14 regular>Hunting the best tiffin for you</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    goBackBtn:
    {
        paddingVertical: dimens.w2o5,
    },
});
export default OrderSuccess;