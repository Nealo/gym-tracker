import React, { Component } from 'react';
import {
  StyleSheet,
  WebView,
} from 'react-native';

class Video extends React.Component{
  render() {
    console.log(this.props);
    return (
      <WebView
        startInLoadingState={true}
        style={styles.webview}
        source={{uri: this.props.uri}}
      />
    );
  }
}

var styles = StyleSheet.create({

});

module.exports = Video;
