import React from 'react';
import { Button, Text, View } from 'react-native';

class Setting extends React.Component {
    render() {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Settings!</Text>
          <Button
            title="Go to Home"
            onPress={() => this.props.navigation.navigate('Meals')}
          />
        </View>
      );
    }
  }
  export default Setting