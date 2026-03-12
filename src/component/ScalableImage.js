import React from 'react';
import PropTypes from 'prop-types';
import { Image, TouchableOpacity, ImageBackground } from 'react-native';
import resolveAssetSource from  'react-native/Libraries/Image/resolveAssetSource';

{/* <ScalableImage
              width = {constants.screenWidth}
              source={Images.splashFood}/> */}

export default class ScalableImage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            size: {
                width: null,
                height: null,
            }
        };
        this.mounted = false;
    }

    componentDidMount() {
        this.mounted = true;
        this.onProps(this.props);
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return null;
    }

    onProps(props) {
        if (props.source && props.source.uri) {
            Image.getSize(props.source.uri, (width, height) => this.adjustSize(width, height, props), console.log);
        }
        else if (props.source) {
            const source = resolveAssetSource(props.source);
            if (source) {
                this.adjustSize(source.width, source.height, props);
            }
        }
    }

    adjustSize(sourceWidth, sourceHeight, props) {
        const { width, height, maxWidth, maxHeight } = props;

        let ratio = 1;

        if (width && height) {
            ratio = Math.min(width / sourceWidth, height / sourceHeight);
        }
        else if (width) {
            ratio = width / sourceWidth;
        }
        else if (height) {
            ratio = height / sourceHeight;
        }

        // Deprecated stuff. Added the PR by mistake. You should use only width and height props
        if (maxWidth && sourceWidth * ratio > maxWidth) {
            ratio = maxWidth / sourceWidth;
        }

        if (maxHeight && sourceHeight * ratio > maxHeight) {
            ratio = maxHeight / sourceHeight;
        }

        if (this.mounted) {
            this.setState({
                size: {
                    width: sourceWidth * ratio,
                    height: sourceHeight * ratio
                }
            }, () => this.props.onSize(this.state.size));
        }
    }

    render() {
        const ImageComponent = this.props.background
            ? ImageBackground
            : Image;

        const image = <ImageComponent {...this.props} style={[this.props.style, this.state.size]} />;

        if (!this.props.onPress) {
            return image;
        }

        return (
            <TouchableOpacity onPress={this.props.onPress}>
                {image}
            </TouchableOpacity>
        );
    }
}

ScalableImage.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    onPress: PropTypes.func,
    onSize: PropTypes.func,
    background: PropTypes.bool,
};

ScalableImage.defaultProps = {
    background: false,
    onSize: size => { }
};
