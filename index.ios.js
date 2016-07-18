/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  NavigatorIOS,
  View,
  Text,
} from 'react-native';

import Main from './App/Components/Main';
import Plan from './App/Components/Plan';

class WorkoutTracker extends Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: "Tracker",
          component: Main
        }} />
      // <View>
      //   <Text style={styles.container}>Testing the Router</Text>
      // </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF'
  }
});

AppRegistry.registerComponent('WorkoutTracker', () => WorkoutTracker);
