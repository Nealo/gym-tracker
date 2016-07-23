import React, { Component } from 'react';
import {
  StyleSheet,
} from 'react-native';

module.exports = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginTop: 65,
  },
  header: {
    flex: 1,
    flexDirection: "row",
  },
  headerPlan : {
    padding: 5,
    paddingLeft: 10,
    flex: 3
  },
  headerExtra: {
    paddingTop: 10,
    flex: 1,
    alignItems: 'center',

  },
  headerExtraText: {
    fontSize: 16,
    fontWeight: "700",
  },
  textInput: {
    height: 30,
  },
  daySection: {
    height: 10,
    flex: 1,
    flexDirection: "row",
  },
  dayView: {
    flex: 1,
    padding: 10,
    // alignItems: 'center',

  },
  dayMain: {
    alignItems: 'flex-start',
  },

  dayText: {
    fontSize: 24,
    fontWeight: "700",
  },
  dayButton: {

  },
  currentDay: {
    color: '#4a81a8',
  },
  exerciseSection: {


    flex: 7,
    // marginTop: -75,
    // overflow: 'hidden',
  },
  exerciseRow: {
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 40,

  },
  exerciseHead: {
    flex: 2,
    flexDirection: 'row',
    marginBottom: 20,
  },
  exerciseName: {
    flex: 2,
  },
  exerciseNameText: {
    fontSize: 20,
  },
  videoLink: {
    flex: 1,
  },
  videoText: {

  },
  exerciseBody: {
    flex: 3,
    flexDirection: 'row',
  },
  weightDisplay: {
    flex: 1,
  },
  weightDisplayInput: {
    height: 30,
    fontSize: 30,
    color: '#4a81a8',
    fontWeight: '700',
    textDecorationLine: 'underline'
  },
  unitChange: {
    flex: 1,
    paddingTop: 10,

  },
  unitText: {
    color: '#a1a1a1',
    fontWeight: "700",
  },
  setTimes: {
    paddingLeft: 20,
    paddingTop: 7,
    fontWeight: "700",
    color: "#a1a1a1",
    justifyContent: 'center',
  },
  setDisplay: {
    flex: 1,
    height:30,
    fontSize:18,
    color: '#a1a1a1',
  },
  weightIncrements: {
    flex: 3,
    flexDirection: 'row',
  },
  weightIncrementBox: {
    alignItems: 'center',
    flex: 1,
  },
  weightIncrement: {
    borderWidth: 2,
    borderColor: "#888",
    borderRadius: 50,
    padding: 6,
    width: 34,
  },
  addExercise: {
    flex: 1,

    alignItems: 'center',

  },

  planPage: {
    padding: 15,
    marginTop: 65,
  },
  planName: {
    fontSize: 26,
  },

  picker: {
    padding: 0,
    margin: 0,
    height: 30,
    borderWidth: 1,
  },
  pickerItem: {
    flex: 1,
    height: 30
  },
  modalHeader: {
    alignItems: 'center',
  },
  modalHeaderText: {
    fontSize: 24,
  },

  exerciseModalHeaderText: {

  },
  modal: {
    paddingTop: 30,
    flex: 1,
  },
  modalFooter: {
    marginTop: 20,
    flex: 1,

  },
  exerciseSectionFooter: {
    flex: 1,
  },
  button: {
    // flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
  },
  buttonCreate: {
    backgroundColor: 'green',
  },
  buttonExit: {
    backgroundColor: '#4a81a8',
  },
  buttonDelete: {
    backgroundColor: 'red',
  },
  buttonRemove: {
    backgroundColor: '#f06d06',
  },
  planModal: {

  },
  exerciseModal: {

  },
  form: {
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 20,
  },
  formRow: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 8,
    color: '#4a81a8',
  },
  mask: {
    // flex: 1,
    height: 100,
    overflow: 'hidden',
    justifyContent: 'space-around'
  },
  noteInput: {
    flex: 1,
    fontSize: 16,
  }
});

function create(styles: Object): {[name: string]: number} {
  const platformStyles = {};
  Object.keys(styles).forEach((name) => {
    let {ios, android, ...style} = {...styles[name]};
    if (ios && Platform.OS === 'ios') {
      style = {...style, ...ios};
    }
    if (android && Platform.OS === 'android') {
      style = {...style, ...android};
    }
    platformStyles[name] = style;
  });
  return StyleSheet.create(platformStyles);
}
