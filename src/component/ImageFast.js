import React, {Component} from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import styleApp from '../constants/styleApp';
import images from '../constants/images';

/**
 *  Load Image from URL
 * 
 *                      <ImageFast
                            style={{width : 200 , height : 200}}
                            contain 
                            url='https://www.acwholesalers.com/products-image/600/PEA110_79466_600.png' />


     Load image from assets
                         <ImageFast 
                            contain icon
                            source={images.logo} />         

                            icon = style={{width : 24,height:24}}
 */
class ImageFast extends Component {
  render() {
    const {
      icon,
      source, // path like require('..assets/image/a.png')
      url,
      contain,
      center,
      stretch,
      cover,
      rotate,
      style,
      onPress,
      ...props
    } = this.props;

    const iconStyles = [
      styles.defaultStyle,
      source && source,
      icon && styleApp.icon,
      rotate && {transform: [{rotate: this.props.rotate + 'deg'}]},
      style, // rewrite predefined styles
    ];

    const resizeType =
      contain != null
        ? 'contain'
        : center != null
        ? 'center'
        : stretch != null
        ? 'stretch'
        : cover != null
        ? 'cover'
        : 'contain';
    const imagePathUrl = url ? url : source ? source : '';
    const isOnpRess = 'function' === typeof onPress;
    return (
      <Image
        style={[iconStyles, {resizeMode: resizeType}]}
        {...props}
        source={!imagePathUrl ? images.placeHolder : url ? {uri: url} : source}
      />
    );
  }
}

{
  /* <FastImage style={iconStyles} {...props}
                source={!imagePathUrl ? images.placeHolder :
                    url ? { uri: url } : source}
                resizeMode={resizeType}
                onError = {()=> console.log('image error in load image : ImageFast.js')}>
            </FastImage> */
}

const styles = StyleSheet.create({
  //Default style
  defaultStyle: {
    width: 20,
    height: 20,
  },

  icon: styleApp.icon,
});

export default ImageFast;
