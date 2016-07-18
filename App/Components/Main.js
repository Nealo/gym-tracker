import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ListView,
  TouchableHighlight,
} from 'react-native';

import plansData from '../../plans.json';
import exerciseData from '../../exercises.json';

import Plan from './Plan';
import Cheatsheet from './Cheatsheet';
import Video from './Video';

class Main extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      currentPlan: 0,
      currentDay: 0,
      plans: plansData,
      exercises: exerciseData,
      // error: false,
    }
  }

  getExerciseName(id) {
    return this.state.exercises[id].name;
  }

  handlePlanPress() {
    this.props.navigator.push({
      title: "Choose a Plan",
      component: Plan,
      passProps: {
        currentPlan: this.state.currentPlan,
        currentDay: this.state.currentDay,
      }
    });
  }
  handleCheatsheetPress() {
    this.props.navigator.push({
      title: "Cheatsheet",
      component: Cheatsheet
    });
  }
  handleVideoPress(row, e) {
    let exerciseID  = this.state.plans[this.state.currentPlan].days[this.state.currentDay].exercises[row].id;
    let exercise = this.state.exercises[exerciseID];

    let uri = exercise.video;
    let title = exercise.name + " video"

    this.props.navigator.push({
      title: title,
      component: Video,
      passProps: {
        exercise: exercise,
        uri: uri
      }
    })
  }

  handlePlanNameChange(e) {
    let newPlan = this.state.plans[this.state.currentPlan];
    newPlan.name = e.nativeEvent.text;
    this.setState({
      plan: newPlan
    });
  }
  handleDayPress(day) {
    let newState = this.state;
    newState.currentDay = day;

    this.setState(newState)
  }
  handleExerciseNameChange(id, e) {
    let newState = this.state;
    newState.exercises[id].name = e.nativeEvent.text;
    this.setState(newState);
  }
  handleUnitChange(id, e) {
    let newState = this.state;

    newState.plan.days[newState.currentDay].exercises[id].unit = newState.plan.days[newState.currentDay].exercises[id].unit === "lb" ? "kg" : "lb";

    this.setState(newState);
  }
  handleWeightChange(id, e) {
    let newState = this.state;
    // Handle blank input
    let newWeight = e.nativeEvent.text ? e.nativeEvent.text : '';
    // Only parse if not blank
    newWeight = newWeight ? parseFloat(newWeight) : newWeight;
    // Keeps from starting with a non-number
    newWeight = newWeight ? newWeight : '';

    newState.plan.days[newState.currentDay].exercises[id].weight = newWeight;

    this.setState(newState);
  }
  handleSetChange(id, e) {
    let newState = this.state;
    let newSets = e.nativeEvent.text ? e.nativeEvent.text : '';

    newSets = newSets ? parseInt(newSets) : newSets;
    newSets = newSets ? newSets : '';

    newState.plan.days[newState.currentDay].exercises[id].sets = newSets;

    this.setState(newState);
  }
  handleWeightIncrement(id, heavy) {
    let newState = this.state;
    let exercise = newState.plan.days[newState.currentDay].exercises[id];
    let newWeight = exercise.weight;
    let increment = 1;

    if (heavy) {
      increment = exercise.unit === "lb" ? 5 : 2.27;;
    }

    newState.plan.days[newState.currentDay].exercises[id].weight = parseFloat((newWeight + increment).toFixed(2));

    this.setState(newState);
  }

  handleAddExercise(id, e) {
    let newState = this.state;
    let exerciseLength = newState.plan.days[newState.currentDay].exercises.length;
    let newID = this.state.exercises.length;

    newState.exercises[newID] = {
      id: newID,
      name: "New Exercise",
      video: ""
    }

    newState.plan.days[newState.currentDay].exercises[exerciseLength] = {
      id: newID,
      weight: 50,
      sets: 3,
      unit: "lb"
    }

    // scroll to bottom of list view

    this.setState(newState);

  }

  render() {
    let plans = this.state.plans;
    let plan = plans[this.state.currentPlan];
    let currentDay = this.state.currentDay;
    let exercises = plan.days[currentDay].exercises;

    let ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
    let dataSource =  ds.cloneWithRows(exercises);

    let headerDays = plan.days.map((day) =>
        <TouchableHighlight
          key={day.id}
          onPress={() => this.handleDayPress(day.id)}
          style={styles.dayView}
        >
          <View>
            <Text style={[styles.dayText, styles.dayButton]}>
              {day.id+1}
            </Text>
          </View>
        </TouchableHighlight>
      );

    return (
      <View style={styles.mainContainer}>
        {/*Header Section*/}
        <View style={styles.header}>
          <View style={{flex: 1}}>
            <TextInput
              style={{padding: 10, height: 40, borderColor: 'gray', borderWidth: 1}}
              value={plan.name}
              onChange={this.handlePlanNameChange.bind(this)} />

          </View>
          <View style={{padding: 10, flex: 2}}>
              <TouchableHighlight
                onPress={() => this.handlePlanPress()}
              >
                <Text>|></Text>
              </TouchableHighlight>
          </View>
          <View style={{padding: 10,flex: 1}}>
              <TouchableHighlight
                onPress={() => this.handleCheatsheetPress()}
              >
                <Text>?</Text>
              </TouchableHighlight>
            </View>
        </View>

        {/*Day Section*/}
        <View style={{height: 10, flex: 1, flexDirection: "row"}}>
          <View style={styles.dayView}>
            <Text style={[styles.dayText]}>
              Day
            </Text>
          </View>
          {headerDays}
        </View>

        {/*Exercise Section*/}
        <View style={{flex:8, justifyContent: "flex-start"}}  >
          <ListView
            dataSource={dataSource}
            renderRow={(exercise, section, row) =>
              <View>
                <View>
                  <TextInput
                    id={exercise.id}
                    style={{height:40}}
                    value={this.getExerciseName(exercise.id)}
                    onChange={(event) => this.handleExerciseNameChange(exercise.id, event)} />
                  <TouchableHighlight onPress={(event) => this.handleUnitChange(row, event)}>
                    <Text>{exercise.unit}</Text>
                  </TouchableHighlight>
                  <TouchableHighlight onPress={(event) => this.handleVideoPress(row, event)}>
                    <Text>Video</Text>
                  </TouchableHighlight>
                </View>
                <View>
                  {/*Weight Display*/}
                  <TextInput
                    style={styles.weightDisplay}
                    keyboardType='numeric'
                    value={exercise.weight.toString()}
                    onChange={(event) => this.handleWeightChange(row, event)} />
                  {/*Set Display*/}
                  <Text>x</Text>
                  <TextInput
                    style={styles.setDisplay}
                    keyboardType='numeric'
                    value={exercise.sets.toString()}
                    onChange={(event) => this.handleSetChange(row, event)} />
                  {/*Weight Increments*/}
                  <View>
                    <TouchableHighlight
                      style={styles.weightIncrement}
                      onPress={(event) => this.handleWeightIncrement(row)} >
                      <Text>+1</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                      style={styles.weightIncrement}
                      onPress={(event) => this.handleWeightIncrement(row, true)} >
                      <Text>+{exercise.unit === "lb" ? "5" : "2.27"}</Text>
                    </TouchableHighlight>
                  </View>
                  {/*Weight Increments*/}
                </View>
              </View>
            }
          />
          {/*ListView*/}
          <View>
            <TouchableHighlight
              style={styles.addExercise}
              onPress={(event) => this.handleAddExercise(event)} >
                <Text>Add New Exercise</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    ); // return
  }
}

const styles = StyleSheet.create({
  header: {
    // height: 50,
    flex: 1,
    flexDirection: "row",
  },
  mainContainer: {
    flex: 1,
    marginTop: 65,
    padding: 15
  },
  dayView: {
    flex: 1,
    padding: 10,

  },
  dayText: {
    fontSize: 24,
  },
  dayButton: {

  },
  planExercises: {
    marginTop: 10,
    marginBottom: 10
  },
  exerciseName: {

  },
  addExercise: {

  },
  weightDisplay: {
    height: 30,
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#4a81a8',
    fontWeight: '700'
  },
  setDisplay: {
    height:30,
    fontSize:14,
  },
  unitChange: {

  },
  weightIncrement: {
    borderWidth: 2,
    borderColor: "#888",
    borderRadius: 50,
    padding: 6,
    width: 34,
  },
  planPage: {
    padding: 15,
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

module.exports = Main;
