import React, { Component } from 'react';
import {
  StyleSheet,
  WebView
} from 'react-native';

class Cheatsheet extends React.Component{
  render() {
    return (
      <WebView
        startInLoadingState={true}
        style={styles.webview}
        source={{uri: "https://www.julian.com/learn/muscle/workouts#cheat-sheet"}}
      />
    );
  }
}

var styles = StyleSheet.create({

});

module.exports = Cheatsheet;
