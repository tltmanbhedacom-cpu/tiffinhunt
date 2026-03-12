import React, { useContext, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { dimens, styleApp, spacing, constants } from "../constants";
import { Text, ImageFast, Button } from '../component'

/*
return (<NoData 
btnTxt ='Btn'
  isFirst={false}
    onButtonClick={()=>}
    image={images.}
     textOne={"2"}
     textTwo={"2"}   />)
*/
export default function NoData(props) {
    return (<View style={{ flex: 1, }}>
        {props.isFirst ?
            <View />
            :
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ImageFast
                        contain
                        style={{ width: dimens.w17, height: dimens.w17 }}
                        source={props.image} />

                    <Text px22 black bold transform='uppercase' center
                        style={{ marginTop: dimens.w8, paddingHorizontal: dimens.w5 }} >{props.textOne}</Text>
                    <Text px16 black50 regular center style={styles.txt2} >{props.textTwo}</Text>
                </View>
                {/** Go Back Button */}
                {props.btnTxt ?
                    <View style={spacing.viewPadding}>
                        <Button full style={styles.goBackBtn}
                            onPress={() => props.onButtonClick ? props.onButtonClick() : console.log('')}>
                            <Text transform='uppercase' boldSemi white >{props.btnTxt}</Text>
                        </Button>
                    </View> : null}
            </View>
        }
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
