import React, { useEffect, useState } from "react";
import { FlatList } from 'react-native'
import { TouchableOpacity, View } from 'react-native';
import { ImageFast } from ".";
import { images, dimens } from "../constants";

//disabled
export default function RatingBarSmile(props) {
    const [rating, setRating] = useState(props.rating);
    useEffect(() => {
        console.log('RAINT COMPO ',props.rating);
        setRating(props.rating)
        return () => {

        }
    }, [props.rating]);

    
    var iconY = [images.rating1, images.rating2, images.rating3, images.rating4, images.rating5]
    var iconN = [images.rating1u, images.rating2u, images.rating3u, images.rating4u, images.rating5u]


    function renderItem({ item, index }) {
        return (
            <TouchableOpacity
                disabled={props.disabled ? true : false}
                activeOpacity={0.7} onPress={() => { props.OnRating(index + 1); setRating(index+1) }}>
                <ImageFast style={{ width: dimens.w10, height: dimens.w10, marginHorizontal: dimens.w2 }}
                    contain
                    source={index < rating ? iconY[index] : iconN[index]} />
            </TouchableOpacity>)
    }

    return (
        <View style={{alignItems:'center'}}>
            <FlatList
                horizontal={true}
                data={[1, 2, 3, 4, 5]}
                renderItem={renderItem}
                keyExtractor={(item, index) => { return 'key' + index }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}