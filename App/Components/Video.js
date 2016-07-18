import React, { Component } from 'react';
import {
  StyleSheet,
  WebView,
} from 'react-native';

class Video extends React.Component{
  render() {
    return (
      <WebView
        source={{uri: this.props.uri}}
      />
    );
  }
}

var styles = StyleSheet.create({

});

module.exports = Video;
