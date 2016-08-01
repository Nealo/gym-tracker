import React, { Component } from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  AsyncStorage,
} from 'react-native';

import styles from '../Helpers/Styles.js';

class Video extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      notes: ""
    }
  }

  componentDidMount() {
    this._loadInitialState().done();
  }

  async _loadInitialState() {
    try {
      var notes = await AsyncStorage.getItem('notes');

      if (notes !== null) {
        this.setState({notes: notes});
      } else {
        console.log("null");
      }
    } catch (error) {
      console.log(this.state);
      console.log(error);
    }
  }

  handleNotesChange(e) {
    console.log(e.nativeEvent);
    this.setState({
      notes: e.nativeEvent.text
    });

    AsyncStorage.setItem('notes', e.nativeEvent.text);
  }

  render() {
    return (
      <View style={[styles.mainContainer, styles.notes]}>
        <TextInput
          style={styles.noteInput}
          value={this.state.notes}
          multiline={true}
          onChange={(e) => this.handleNotesChange(e)}
          />
      </View>
    );
  }
}



module.exports = Video;
