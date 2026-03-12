import React, { Component } from 'react'
import {
    Modal,
    View,
    TouchableWithoutFeedback,
    Platform,
    StyleSheet,
    TouchableOpacity, 
} from 'react-native'

import { Loader, Button, Text, TextInputView, ImageIcon, ImageFast, ScalableImage } from '../component'
import { constants, images, colors, styleApp, dimens, spacing, keys } from '../constants'
const { OS } = Platform;

{/* <PermissionDialogModel
onTouchOutside={() => this.hideShowDialog(1, false)}
onClickButton={this.OnClickOnModel}
visible={this.state.isShowDownloadView} /> 

 hideShowDialog = (type,isShow) => {
        this.setState({
            isShowDownloadView: isShow
        })
    }
*/}

class PermissionDialogModel extends Component {
    constructor(props) {
        super(props)

    }

    _renderOutsideTouchable(onTouch) {
        const view = <View style={{ flex: 1, width: '100%' }} />
        if (!onTouch) return view;
        return (
            <TouchableWithoutFeedback onPress={onTouch} style={{ flex: 1, width: '100%' }}>
                {view}
            </TouchableWithoutFeedback>
        )
    }

    render() {
        const {
            visible, onTouchOutside
        } = this.props;

        const dialogBorderRadius = OS === 'ios' ? 7 : 10;
        return (
            <Modal
                animationType={'fade'}
                transparent={true}
                visible={visible}>

                <View style={styles.root}>

                    <View style={[styles.container, {
                        borderRadius: dialogBorderRadius,
                    }]}>


                        <View style={{ marginTop: dimens.w5, alignItems: 'center', justifyContent: 'center' }}>
                            <ImageFast
                                contain
                                style={styles.imgLogoPermissionStyle}
                                source={images.locationBlue} />
                        </View>

                        <Text
                            style={{ textAlign: 'center', marginTop: dimens.w5 }}
                            px20 center boldSemi>Location Permission</Text>
                        <Text
                            style={{ textAlign: 'center', marginTop: 10 }}
                             px16 center  black50 regular>TiffinHunt needs your {'\n'} authorization to locate your {'\n'}
                            position and nearby places.</Text>

                        <View style={{ width: '100%', backgroundColor: colors.divider, marginTop: dimens.w7, height: 0.5 }}>
                        </View>

                        <View style={{ alignContent: 'center', flexDirection: 'row', width: '100%' }}>
                            <TouchableOpacity onPress={()=>this.props.onClick(false)} style={{ flex: 1 }}>
                                <Text style={styles.lblTxtStyle} px18 black50>Later</Text>
                            </TouchableOpacity>
                            <View style={{ height: '100%', width: 0.5, backgroundColor: colors.divider }}></View>
                            <TouchableOpacity onPress={()=>this.props.onClick(true)} style={{ flex: 1 }}>
                                <Text style={styles.lblTxtStyle} px18 medium black>Allow</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}

PermissionDialogModel.defaultProps = {
    visible: false,
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "#000000AA",
        // paddingTop: 20,
        // paddingBottom: 20,
        justifyContent: 'center',
    },
    container: {
        width: '78%',
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: 'white',
        // paddingBottom: dimens.w5,
        // padding: dimens.w5,
    },
    buttonConfirm: {
        marginVertical: dimens.h1,
        marginHorizontal: dimens.w7
    },
    imgLogoPermissionStyle:
    {
        paddingVertical: dimens.w5,
        width: dimens.w14,
        height: dimens.w14,
        marginTop:dimens.w3,
    },
    lblTxtStyle:
    {
        paddingVertical: dimens.w3,
        textAlign: 'center'
    }
});
export default PermissionDialogModel;