import React, {Component} from 'react';
// import SplashScreen from 'react-native-splash-screen';
import Navigation from './navigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StatusBar} from 'react-native';

import * as color from '@config/color';

import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './store';

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaProvider>
            <StatusBar backgroundColor={color.primary} />
            <Navigation />
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    );
  }
}
