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
  AsyncStorage,
} from 'react-native';

import Main from './App/Components/Main';
import Plan from './App/Components/Plan';

import plansData from './plans.json';
import exerciseData from './exercises.json';

class WorkoutTracker extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // AsyncStorage.getItem('plans', (err, plans) => {
    //   if (!plans) {
    //     AsyncStorage.setItem('plans', JSON.stringify(plansData), () => {
    //         AsyncStorage.setItem('exercises', JSON.stringify(exerciseData), () => {
    //
    //         });
    //     });
    //
    //   }
    // })

    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: "Weight Tracker",
          component: Main
        }} />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF'
  }
});

AppRegistry.registerComponent('WorkoutTracker', () => WorkoutTracker);
