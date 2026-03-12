import React, { Component } from 'react'
import { Text, StyleSheet } from 'react-native'


import Color from '../constants/colors'
import FontSize from '../constants/FontSize'
import font from '../constants/font'

export default class Typography extends Component {

    render() {
        const {
            size,
            transform, //uppercase,capitalize,none,lowercase
            align,  // left,right,center,justify,auto
            // styling
            regular,
            bold,
            medium,
            boldSemi,
            boldExtra,
            center,
            centerFlex,
            flex1,
            right,
            spacing, // letter-spacing
            height, // line-height space between two line
            underline,
            //Font size
            px10,
            px12,
            px14,
            px16,
            px18,
            px20,
            px22,
            // colors
            color,
            accent,
            primary,
            black,
            white,
            red,
            ab9a9d,
            blueDark,
            grayLight,
            black50,
            style,
            children,
            ...props
        } = this.props;

        const textStyles = [
            styles.text,
            size && { fontSize: size },
            px10 && styles.px10,
            px12 && styles.px12,
            px14 && styles.px14,
            px16 && styles.px16,
            px18 && styles.px18,
            px20 && styles.px20,
            px22 && styles.px22,
            transform && { textTransform: transform },
            align && { textAlign: align },
            height && { lineHeight: height },
            spacing && { letterSpacing: spacing },
            underline && { textDecorationLine: 'underline' },
            regular && styles.regular,
            boldSemi && styles.boldSemi,
            medium && styles.medium,
            bold && styles.bold,
            boldExtra && styles.boldExtra,
            center && styles.center,
            centerFlex && styles.centerFlex,
            flex1 && styles.flex1,
            right && styles.right,
            color && styles[color],
            color && !styles[color] && { color },
            // color shortcuts
            accent && styles.accent,
            primary && styles.primary,
            black && styles.black,
            white && styles.white,
            red && styles.red,
            blueDark && styles.blueDark,
            grayLight && styles.grayLight,
            black50 && styles.black50,
            ab9a9d && styles.ab9a9d,

            style // rewrite predefined styles
        ];

        return (
            <Text style={textStyles} {...props}
            >
                {children}
            </Text>
        );
    }
}

const styles = StyleSheet.create({
    // default style
    text: {
        fontSize: FontSize.FONT_12Px,
        color: Color.black,
        includeFontPadding: false

    },
    // variations
    regular: {
        fontFamily: font.regular,
    },
    bold: {
        fontFamily: font.bold,
    },
    medium: {
        fontFamily: font.medium,
    },
    boldSemi: {
        fontFamily: font.boldSemi,
    },
    boldExtra: {
        fontFamily: font.boldExtra,
    },
    // position
    center: { textAlign: "center" },
    centerFlex: { textAlign: "center", flex: 1 },
    flex1: { flex: 1 },
    right: { textAlign: "right" },
    // colors
    accent: { color: Color.accent },
    primary: { color: Color.primary },
    black: { color: Color.black },
    white: { color: Color.white },
    red: { color: Color.red },
    blueDark: { color: Color.fontBlueDark },
    grayLight: { color: Color.fontGrayLight },
    black50 : {color : Color.fontBlack50},
    ab9a9d: { color: Color.fontAb9a9d },
    // fonts size
    px10: { fontSize: FontSize.FONT_10Px },
    px12: { fontSize: FontSize.FONT_12Px },
    px14: { fontSize: FontSize.FONT_14Px },
    px16: { fontSize: FontSize.FONT_16Px },
    px18: { fontSize: FontSize.FONT_18Px },
    px20: { fontSize: FontSize.FONT_20Px },
    px22: { fontSize: FontSize.FONT_22Px },
});