/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Navigator,
  View,
  Text,
  TouchableHighlight,
} from 'react-native';

import Main from './App/Components/Main';
import Notes from './App/Components/Notes';
import Video from './App/Components/Video';
import Cheatsheet from './App/Components/Cheatsheet';

class WorkoutTracker extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const routes = [
      {title: "Julian Gym Tracker", index: 0},
      {title: "Notes", index: 1},
      {title: "Cheatsheet", index: 2},
      {title: "Exercise Video", index: 3},
    ]
    return (

      <Navigator
        style={styles.container}
        initialRoute={routes[0]}
        initialRouteStack={routes}
        renderScene={(route, navigator) =>
          {
            if (route.index == 0) {
              return <Main routes={routes} navigator={navigator} />
            } else if (route.index == 1) {
              return <Notes routes={routes} navigator={navigator} />
            } else if (route.index == 2) {
              return <Cheatsheet routes={routes} navigator={navigator} />
            } else if (route.index == 3) {
              return <Video routes={routes} {...route.passProps} />
            }
          }
        }
        navigationBar={
          <Navigator.NavigationBar
            style={styles.nav}
            navigationStyles={Navigator.NavigationBar.StylesIOS}
            routeMapper={{
              LeftButton: (route, navigator, index, navState) => {
                if (route.index !== 0) {
                  return (
                    <TouchableHighlight
                      onPress={() => navigator.pop()}
                      style={styles.backButton} >
                      <Text style={styles.backText}>Back</Text>
                    </TouchableHighlight>
                  )
                } else {
                  return null;
                }
              },
              RightButton: (route, navigator, index, navState) => {
                return(

              null )
              },
              Title: (route, navigator, index, navState) => {
                return (
                  <View style={styles.title}>
                    <Text style={styles.titleText}>{route.title}</Text>
                  </View>)
              }
            }}
          />
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // backgroundColor: '#F5FCFF'
  },
  nav: {
    flex: 1,
    height: 65,
    backgroundColor: '#F5FCFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    // paddingTop: 13,
    alignItems: 'center',
    paddingLeft: 20,
  },
  titleText: {
    fontSize: 18,
  },
  backButton: {
    // paddingLeft: 10,
    // paddingTop: 20,
  },
  backText: {

  }
});

AppRegistry.registerComponent('WorkoutTracker', () => WorkoutTracker);
