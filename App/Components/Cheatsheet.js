import React, { Component } from 'react';
import {
  StyleSheet,
  WebView
} from 'react-native';

class Cheatsheet extends React.Component{
  render() {
    return (
      <WebView
        source={{uri: "http://www.julian.com/workout/cheatsheet"}}
      />
    );
  }
}

var styles = StyleSheet.create({

});

module.exports = Cheatsheet;
