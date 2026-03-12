import React, {Component} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';

import {
  Loader,
  Button,
  Text,
  TextInputView,
  ImageIcon,
  ImageFast,
  ScalableImage,
} from '../component';
import {constants, images, colors, styleApp, dimens} from '../constants';

let imgWidth = constants.screenWidth * 0.8;
let imgHeight = imgWidth * 0.45;

const BannerList = (props) => {

   const onRowClick = index => {
        props?.onClick(index, index);
      };

      const  renderItem = ({item, index}) => {
        console.log('items : ', item);
        return (
          <TouchableOpacity
            onPress={() => onRowClick(item)}
            style={[
              styles.containerData,
              styleApp.shadows,
              
            ]}>
            {/* <ImageFast
                        style={{ width: imgWidth, height: imgHeight }}
                        stretch
                        url={item.image} /> */}
            <Image
              style={{width: imgWidth, height: imgHeight,resizeMode : 'contain'}}
              source={{uri: item.image}}
            />
          </TouchableOpacity>
        );
      };
      const  _keyExtractor = (item, index) => item.id + '';
    
      return (
        <View>
          <FlatList
            horizontal={true}
            data={props?.listData}
            extraData={props}
            renderItem={renderItem}
            keyExtractor={_keyExtractor}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      );
}

// class BannerList extends Component {
//   constructor(props) {
//     super(props);
//     console.log(this.props.listData);
//   }

//   onRowClick = index => {
//     this.props.onClick(index, index);
//   };

//   renderItem = ({item, index}) => {
//     console.log('items : ', item);
//     return (
//       <TouchableOpacity
//         onPress={() => this.onRowClick(item)}
//         style={[
//           styles.containerData,
//           styleApp.shadows,
//           {backgroundColor : 'red'}
//         ]}>
//         {/* <ImageFast
//                     style={{ width: imgWidth, height: imgHeight }}
//                     stretch
//                     url={item.image} /> */}
//         <Image
//           style={{width: imgWidth, height: imgHeight,resizeMode : 'contain'}}
//           source={{uri: item.image}}
//         />
//       </TouchableOpacity>
//     );
//   };
//   _keyExtractor = (item, index) => item.id + '';

//   render() {
//     return (
//       <View>
//         <FlatList
//           horizontal={true}
//           data={this.props.listData}
//           extraData={this.props}
//           renderItem={this.renderItem}
//           keyExtractor={this._keyExtractor}
//           showsHorizontalScrollIndicator={false}
//         />
//       </View>
//     );
//   }
// }

const styles = StyleSheet.create({
  containerData: {
    flex: 1,
    backgroundColor: 'pink',
    marginEnd: dimens.w5,
    borderRadius: dimens.w3,
    overflow: 'hidden',
  },
});

export default BannerList;
