import React, { Component } from 'react';
import {
  StyleSheet,
  Platform,
} from 'react-native';

module.exports = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginTop: 70,
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
  planName: {
    fontSize: 30,
  },
  headerExtra: {
    paddingTop: 11,
    paddingRight: 10,
    flex: 1,
    alignItems: 'flex-end',

  },
  headerExtraText: {
    fontSize: 30,
    fontWeight: "700",
    paddingTop: 0,
    ...Platform.select({
      ios: {
        paddingTop: -6,
      },
      // android: {
      //   paddingTop: -10,
      // }
    })
  },
  textInput: {
    height: 30,
    borderWidth: 0,
  },
  daySection: {
    height: 10,
    flex: 1,
    flexDirection: "row",
  },
  dayView: {
    flex: 1,
    padding: 5,
    alignItems: 'center',

  },
  dayMain: {
    paddingLeft: 10,

    alignItems: 'flex-start',
  },

  dayText: {
    fontSize: 25,
    fontWeight: "700",
  },
  dayButton: {

  },
  dayCurrent: {
    color: '#4a81a8',
  },
  dayEmpty: {
    color: '#999',
  },
  exerciseSection: {


    flex: 7,
    // marginTop: -75,
    // overflow: 'hidden',
  },
  exerciseRow: {
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 50,

  },
  exerciseHead: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  exerciseName: {
    flex: 2,
  },
  exerciseNameText: {
    fontSize: 24,
  },
  videoLink: {
    paddingTop: 3,
    paddingLeft: 10,
    flex: 1,
    alignItems: 'flex-end',
  },
  videoImage: {

    width: 26,
    height: 26,

  },
  videoText: {

  },
  exerciseBody: {
    flexDirection: 'row',
  },
  weightDisplay: {
    flex: 2,
    paddingTop: 3,
  },
  weightDisplayInput: {

    fontSize: 35,
    color: '#4a81a8',
    fontWeight: '700',
    ...Platform.select({
      ios: {
        height: 35,
      },
      android: {
        height: 50,
        // underlineColorAndroid: "transparent",
      }
    })
    // textDecorationLine: 'underline'
  },
  unitChange: {
    flex: 1,
    paddingTop: 12,

  },
  unitText: {
    color: '#a1a1a1',
    fontWeight: "700",
    fontSize: 18,
  },
  setTimes: {
    paddingLeft: 20,
    paddingTop: 15,
    fontWeight: "700",
    color: "#a1a1a1",
    justifyContent: 'center',

    ...Platform.select({
      android: {
        paddingTop: 30,
      }
    })
  },
  setDisplay: {

    paddingTop: 8,
    flex: 1,

    fontSize:24,
    color: '#a1a1a1',
    ...Platform.select({
      ios: {
        height:35,
      },
      android: {
        height: 50,
      }
    }),
  },
  weightIncrements: {
    flex: 3,
    flexDirection: 'row',
  },
  weightIncrementBox: {
    alignItems: 'flex-end',
    flex: 1,
  },
  weightIncrement: {
    borderWidth: 2,
    borderColor: "#666",
    borderRadius: 50,
    padding: 10,
    width: 42,
  },
  addExercise: {
    flex: 1,

    alignItems: 'center',

  },
  scrollIndicator: {
    alignItems: 'center',
    padding: 10,
    height: 50,
    justifyContent: 'center',

  },
  scrollIndicatorImage: {
    width: 60,
    height: 20,

  },

  planPage: {
    padding: 15,
    marginTop: 65,
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
    marginBottom: 10,
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
  modalContent: {
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 30,
  },
  modalListItem: {
    marginBottom: 15,
    fontSize: 14,
  },
  modalMessage: {
    paddingLeft: 10,
    paddingRight: 10,
    height: 40,
    justifyContent: 'center',
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
  buttonAdd: {
    backgroundColor: 'lightgreen'
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
    fontSize: 14,
  },
  mask: {
    // flex: 1,
    height: 100,
    overflow: 'hidden',
    justifyContent: 'space-around'
  },
  noteImage: {
    height:24,
    width: 24,
  },
  noteInput: {
    flex: 1,
    fontSize: 16,
  },
  notes: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  webview: {

    ...Platform.select({
      android: {
        marginTop: 65,
      }
    })
  }
});
