import React, { useEffect, useState } from "react";
import { TouchableOpacity, Dimensions, SafeAreaView, StyleSheet, Image, View, FlatList, Platform, Alert } from 'react-native';
import { Loader, Button, Text, TextInputView, ImageIcon, ImageFast, Header } from '../component'
import { constants, images, colors, styleApp, dimens, spacing } from '../constants'
import { useDispatch, useSelector } from 'react-redux';
import { WebView } from 'react-native-webview';
/**
 *  Props
 *  ------
 *  title
 *  url 
 *
 */
var title=''
export default function WebViews({ route, navigation }) {
    const dispatch = useDispatch();
    const [url, setUrl] = useState('https://www.google.com');
    useEffect(() => {
         title = route.params.title;
        setUrl(route.params.url)
        return () => {
            title=''
        }
    }, []);


    return (
        <SafeAreaView style={styleApp.safeAreaRoot}>
            <View style={styleApp.container}>
                <Header titleLeft title={title} />
                <View style={[styleApp.container]}>
                    {url.length > 0 ?
                    <WebView source={{ uri: url }} />:null
                    }
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    
  });
