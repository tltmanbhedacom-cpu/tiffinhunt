import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { styleApp, colors, fontSize, dimens } from '../constants'
import { Text } from '../component'

/**
 *  OutLine with Round
 *      <Button  outline round>
            <Text center >Use current location</Text>
        </Button>

        set icon right side -  <Button  outline iconRight={images.location}>
        set icon left size  -

    OutLine color
    <Button  shadow style={styles.button}
                        outline
                        outlineColor='red'
                        onPress={() => this.props.onOpenLocation()}>
                                 <Text color='black' transform='uppercase'>Get Started</Text>
                    </Button>
 * 
 */
class Button extends Component {

    iconLeft() {
        const { iconLeft } = this.props;
        if (iconLeft == null) return null;
        return (
            <Image
                style={[styleApp.buttonIconLeft, styleApp.iconButton]}
                source={iconLeft}
            />
        );
    }
    iconRight() {
        const { iconRight } = this.props;
        if (iconRight == null) return null;
        return (
            <Image
                style={[styleApp.buttonIconRight, styleApp.iconButton]}
                source={iconRight}
            />
        );
    }

    render() {
        const {
            style,
            color,
            width,
            full,
            opacity,
            center,
            round,
            noBorder, // No border
            children,
            shadow,
            outline,
            outlineColor,
            iconLeft,
            iconRight,
            //Font size
            px30,
            px42,
            ...props
        } = this.props;

        const buttonStyles = [
            styles.button,
            px30 && styles.px30,
            px42 && styles.px42,
            width && { width: width },
            full && { width : '100%' },
            shadow && styleApp.shadows,
            color && styles[color], // predefined styles colors for backgroundColor
            color && !styles[color] && { backgroundColor: color }, // custom backgroundColor
            round && [styles.button, styles.roundCorner],
            outline && styles.outline,
            center && { alignSelf: 'center' },
            outlineColor && [styles.outline, { borderColor: outlineColor }],
            noBorder && [styles.noBorder],
            style // rewrite predefined styles
        ];

        return (
            <TouchableOpacity
                style={[buttonStyles]}
                activeOpacity={opacity}
                {...props}>
                {this.iconLeft()}
                {children}
                {this.iconRight()}
            </TouchableOpacity>
        )
    }
}
Button.defaultProps = {
    opacity: 0.8,
    color: colors.primary,

}

export default Button;

const borderRadios = 50;

const styles = StyleSheet.create({

    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: dimens.w2,
        paddingVertical: dimens.w2,
        paddingHorizontal: dimens.w6,
        marginVertical: dimens.h1, //By default it will set margin top and bottom
    },
    roundCorner: {
        borderRadius: borderRadios
    },
    noBorder: {
        borderWidth: 0,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.outline
    },
    px30: {
        fontSize: fontSize.FONT_10Px
    },
    px42: {
        fontSize: fontSize.FONT_14Px
    },
});