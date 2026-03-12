import React, { useEffect, useState } from "react";
import { TouchableOpacity, Dimensions, SafeAreaView, StyleSheet, Image, View, FlatList, Platform, Alert } from 'react-native';
import { Loader, Button, Text, TextInputView, ImageIcon, ImageFast, Header } from '../component'
import { constants, images, colors, styleApp, dimens, spacing } from '../constants'
import { useDispatch, useSelector } from 'react-redux';

export default function Dummy({ route, navigation }) {
    const dispatch = useDispatch();
    const [isFetching, setIsFetching] = useState(false);
    useEffect(() => {
        return () => {
            console.log('COMPONENT  unmount');
        }
    }, []);

    return (
        <SafeAreaView style={styleApp.safeAreaRoot}>
            <View style={styleApp.container}>
                <Loader loading={isFetching} />
                <Header title="Title" />
                <View style={[styleApp.container, spacing.viewPadding]}>

                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    
  });
