import React from 'react';
import { Button, Text, View, StyleSheet, SafeAreaView } from 'react-native';
// import ViewPager from '@react-native-community/viewpager';

class Intro extends React.Component {
  renderIntroData = () => {
    const planList = [];
    var images = ['a.png', 'b.png', 'c.png']
    var title = ['Title 1', ' Title 2 ', ' Title 3']
    var message = ['MSG 1', ' MSG 2 ', ' MSG 3']
    for (let i = 0; i < images.length; i++) {
      planList.push(
        <View key={i + ""}>
          <View style={{ backgroundColor: 'red' }}>
            <Text>{title[i]}</Text>
            <Text>{message[i]}</Text>
          </View>
        </View>
      )
    }
    return planList;
  }

  render() {
    return (
      <SafeAreaView style={{flex : 1 ,}}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginVertical : 100 }}>
          <Text>Intro!</Text>

          {/* <ViewPager style={styles.viewPager} 
          initialPage={0}
          showPageIndicator = {true}
          pageIndicatorColor= 'red'
          activePageIndicatorColor = 'green'
          >
            {this.renderIntroData()}
          </ViewPager> */}

          <Button
            title="Go to Login from intro"
            onPress={() => this.props.navigation.navigate('Login')}
          />
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  viewPager: {
    backgroundColor: 'pink',
    width: '100%',
    flex: 1
  },
});


export default Intro