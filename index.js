/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { Provider } from 'react-redux';
import React  from 'react';
import store from './src/redux/store/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';

// Enable react-native-screens for better performance
enableScreens();

const RNRedux = () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <Provider store = { store }>
      <App />
    </Provider>
  </GestureHandlerRootView>
)


AppRegistry.registerComponent(appName, () => RNRedux);
