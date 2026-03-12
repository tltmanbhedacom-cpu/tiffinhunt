import { Platform } from 'react-native';

import { constants } from './constants';
import images from './images';
import fontSize from './FontSize';
import colors from './colors';
import font from './font';
import { dimens } from './dimens';

const styleApp = {
    blueSmallDivider: {
        backgroundColor: colors.primary,
        height: dimens.w1, width: dimens.w7, marginVertical: dimens.w1
    },
    textInputPadding: {
        paddingStart: dimens.w3
    },
    textInputRoot: {
        marginHorizontal: constants.marginH, marginTop: dimens.h1, flexDirection: 'row'
    },
    buttonPadding: {
        paddingVertical: dimens.h1_3,
    },
    errorText: {
        fontSize: fontSize.FONT_10Px,
        // fontFamily: font.regular,
        color: 'red',
    },
    headerTitleImage: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end',
        padding: dimens.w2, marginTop: dimens.w1
    },
    titleToolbar: {
        padding: 0,
        width: '100%',
        textAlign: 'center',
        padding: dimens.w3,
    },
    buttonIconLeft: {
        marginEnd: dimens.w2
    },
    buttonIconRight: {
        marginStart: dimens.w1
    },
    safeAreaRoot: {
        display: 'flex',
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
        display: 'flex',
        flex: 1,
        backgroundColor: 'white',

    },
    dividerH: {
        width: '100%',
        height: 0.5,
        backgroundColor: colors.divider,
    },
    iconPadding: {
        padding: dimens.w1,
        margin: -dimens.w1
    },
    listFooterPadding: {
        height: 60,
        width: '100%',
        backgroundColor: ''
    },
    icon: {
        width: dimens.w5,
        height: dimens.w5,
    },
    iconBig: {
        width: dimens.w15,
        height: dimens.w15,
    },
    iconButton: {
        width: dimens.w4,
        height: dimens.w4,
    },
    appLogo: {
        width: '80%',
        height: '9%',
        resizeMode: "contain",
        alignSelf: 'center',
        marginTop: '13%'
    },
    offer: {
        backgroundColor: colors.green5,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: colors.fontGreen,
        borderRadius: constants.borderRadius,
        textAlign: 'center',
        marginTop: dimens.w2,
        padding: dimens.w2
    },

    shadowCorner: {
        borderRadius: constants.borderRadius,
    },
    shadows: {
        ...Platform.select({
            ios: {
                backgroundColor: 'white',
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 4,
                },
                shadowOpacity: 0.22,
                shadowRadius: 3.46,
                elevation: 4,
            },
            android: {
                shadowOffset: {
                    width: 0,
                    height: 4,
                },
                shadowColor: '#000',
                shadowOpacity: 0.32,
                shadowRadius: 5.46,
                elevation: 4,
                backgroundColor: 'white'
            },
        }),
    },
};
export default styleApp;
