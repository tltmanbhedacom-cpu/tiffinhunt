import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../constants';



export default function DividerH(props) {
    return (<View
        style={[{flex :1, height: 1,  backgroundColor: colors.divider },props.style]}
    />)
}

const styles = StyleSheet.create({

});
