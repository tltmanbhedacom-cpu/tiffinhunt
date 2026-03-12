import { StyleSheet, Platform } from 'react-native';
import { constants } from './constants';

//https://medium.com/@kelleyannerose/configuring-a-new-react-native-app-171467cd0ed8
const spacing = StyleSheet.create({
    container: {
        display: 'flex',
        flex : 1,
        width :'100%',
        backgroundColor: 'white',
    },
    viewPadding: {
        padding: constants.viewPadding
    },
    viewPaddingHorizontal: {
        paddingLeft: constants.viewPaddingH,
        paddingRight: constants.viewPaddingH
    },
    viewPaddingVertical: {
        paddingTop: constants.viewPaddingV,
        paddingBottom: constants.viewPaddingV
    },
    viewMarginHorizontal: {
        marginHorizontal : constants.defaultMargin
    },
    viewMarginVertical: {
        marginVertical : constants.defaultMargin
    },
    formTopPadding : {
        paddingTop: constants.formTopPadding,
    }

});

export default spacing;