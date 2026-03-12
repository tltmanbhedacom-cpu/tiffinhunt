import React, { Component } from 'react';
import { View, Animated, StyleSheet, TextInput, Platform } from 'react-native';
import { string, func, bool } from 'prop-types';
import { constants, images, fontSize, colors, font } from '../constants'
import Text from './Text'
import styleApp from '../constants/styleApp';
import { dimens } from '../constants/dimens';

/**                     maxLength={10}
                        multiline = {true}
                        
 *                            <TextInputView
                                        attrName='username'
                                        title='USERNAME'
                                        titleTextColor={colors.fontAb9a9d}
                                        textColor='white'
                                        isBorder={false}
                                        underLineColor='white'
                                        email
                                        value={this.state.username}
                                        updateMasterState={this._updateMasterState} />

        ************* How To use in FlatList *********
           _updateMasterState = (attrName, value, rowPosition) => {
                 console.log(attrName + " "+value + " "+rowPosition);
            }

             <TextInputView
                        attrName='notes'
                        title='Notes'
                        isBorder={false}
                        rowPosition={index}
                        errorText='Please enter notes.'
                        isError={isNotValidNotes}
                        underLineColor={colors.divider}
                        updateMasterState={this._updateMasterState} />
 * 
 * 
 */
export default class TextInputView extends Component {
    static propTypes = {
        attrName: string.isRequired,
        title: string,
        titleTextColor: string,
        placeholder : string,
        errorText: string,
        isError: bool,
        textColor: string,
        underLineColor: string,
        isBorder: bool,
        value: string,
        updateMasterState: func.isRequired,
        secure: bool,
    }

    constructor(props) {
        super(props);
        const { value } = this.props;

        this.position = new Animated.Value(value ? 1 : 0);
        this.defaultTitleTextColor = colors.fontFloatingGray;
        this.state = {
            isFieldActive: value ? 1 : 0,
        }
    }

    _onChangeText = (updatedValue) => {
        const { attrName, updateMasterState, rowPosition } = this.props;
        updateMasterState(attrName, updatedValue, rowPosition);
    }

    _errorText() {
        if (this.props.errorText == null || this.props.errorText == '' ||
            this.props.isError == null || !this.props.isError) return null;
        return (
            <Text style={styleApp.errorText}>{this.props.errorText}</Text>
        )
    }

    headerTitle() {
        if (this.props.headerTitle == null || this.props.headerTitle == '') return null;
        return (
            <Text style={Styles.headerTitle}>{this.props.headerTitle}</Text>
        )
    }

    render() {
        const {
            email,
            phone,
            number,
            isBorder,
            title,
            value,
            textColor,
            underLineColor,
            multiline,
            maxLength,
            actionDone,
            autoCapNone,
            style,
            ...props
        } = this.props;

        const textStyles = [
            Styles.textInput,
            { color: textColor != null ? textColor : 'black' },
            style
        ];
        const inputType = email
            ? 'email-address' : number
                ? 'numeric' : phone
                    ? 'phone-pad' : 'default';
        const imeAction = actionDone ? "done" : "next";
        return (
            <View style={{width : '100%'}} {...props}>
               {this.headerTitle()}
                <View style={!isBorder ? Styles.container : Styles.containerBorder} >
                    <TextInput
                        multiline={multiline}
                        value={value}
                        style={textStyles}
                        secureTextEntry={this.props.secure}
                        onChangeText={this._onChangeText}
                        placeholder = {this.props.placeholder}
                        keyboardType={inputType}
                        autoCorrect={false}
                        autoCapitalize = {autoCapNone ? 'none' :'sentences'}
                        maxLength={maxLength ? maxLength : 500}
                        returnKeyType={imeAction} />
                   
                </View>
                {this._errorText()}
            </View>
        )
    }
}

//Default margin between two floatingTextInput
const marginFloatingLabel = dimens.w1;

const Styles = StyleSheet.create({
    headerTitle : {
        fontSize: fontSize.FONT_12Px,
        fontFamily: font.regular,
        includeFontPadding: false,
        marginBottom :dimens.ho5
    },
    container: {
        width: '100%',
        marginVertical: marginFloatingLabel,
    },
    containerBorder: {
        width: '100%',
        borderRadius: 4,
        borderStyle: 'solid',
        borderColor: colors.borderColor,
        borderWidth: 1,
        marginBottom: marginFloatingLabel,
    },
    textInput: {
        fontSize: fontSize.FONT_14Px,
        fontFamily: font.regular,
        color: 'black',
        paddingVertical: dimens.h1,
        paddingHorizontal: dimens.w1,
        includeFontPadding: false,
    },
    titleStyles: {
        position: 'absolute',
        fontSize: fontSize.FONT_10Px,
        fontFamily: font.regular,
        includeFontPadding: false,
        left: Platform.OS === 'ios' ? 0 : 3,
        left: Platform.OS === 'ios' ? 0 : 4,
    },
    inputUnderLine: {
        width: '100%',
        height: 1,
        left: Platform.OS === 'ios' ? 0 : 3,
        left: Platform.OS === 'ios' ? 0 : 4,
    }
})