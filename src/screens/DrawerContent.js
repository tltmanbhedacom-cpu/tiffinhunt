
import React from 'react';
import { View, StyleSheet , Text , TouchableOpacity} from 'react-native';

import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';

export default function DrawerContent(props){
    return(<View style={{flex :1,backgroundColor:'pink'}}>
        <DrawerContentScrollView {...props}>
            <View>
                <TouchableOpacity onPress={()=>props.navigation.navigate('Register')}>
                <Text>Main Content</Text>
                </TouchableOpacity>
            </View>
        </DrawerContentScrollView>

        {/**Sign OUt */}
        <Text>Version v1.1</Text>
    </View>)
} 