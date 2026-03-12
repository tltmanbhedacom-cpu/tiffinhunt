import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import ImageIcon from './ImageIcon'

import { useNavigation } from '@react-navigation/native';
import { images, dimens, styleApp } from '../constants';
import { Text } from '../component'

{/* <Header title="Add To Playlist"

icon
titleLeft

onBackClick={() => {
    const selectedSongs = musicDataList.filter(item => item.isSelected);
   navigation.goBack();
    navParam.onSongSelect(selectedSongs);
}} /> */}
export default function Header(props) {
    const navigation = useNavigation();
    return (<View style={[styleApp.headerTitleImage, { justifyContent: 'flex-start' }]}>
        <Text px22 black bold style={[styleApp.titleToolbar,
            {textAlign : props.titleLeft ?'left':'center',
            marginStart : props.titleLeft ? dimens.w15 :0}]}>{props.title}</Text>
        <ImageIcon
            touchableStyle={{ position: 'absolute',marginStart:dimens.w1 }}
            style={{ width: dimens.w14, height: dimens.w14 }}
            path={props.icon ? props.icon :images.back}
            onClick={() => props.onBackClick ? props.onBackClick() : navigation.goBack()} />
    </View>)
}

const styles = StyleSheet.create({

});
