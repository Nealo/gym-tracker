/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */



import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView
} from 'react-native';

import plansData from './plans.json';
import exerciseData from './exercises.json';

let Config = {
  currentDay: 1,
  INCREMENTS_LB: [1,5],
  INCREMENTS_KG: [1,2.27],
  PLANS_URL: "/api/plans",
  WORKOUTS_URL: "/api/workouts",
  EXERCISES_URL: "/api/exercises",
  SETS_URL: "/api/sets"
}

function getExerciseName (id) {
  for (var i = 0; i < exerciseData.length; i++) {
    var exercise = exerciseData[i];

    if (exercise.id == id) {
      return exercise.name;
    }
  }

  return null;
}


class WorkoutTracker extends Component {
  constructor(props) {
    super(props);
    // this.state = plansData[this.props.plan-1];
  }



  render() {
    return (
      <View style={styles.container}>
      <PlanPage plan="1" />
      </View>
    );
  }
}

class PlanPage extends WorkoutTracker {
  constructor(props) {
    super(props);

    this.state = plansData[this.props.plan-1];
  }

  render() {
    data = this.state;

    let exercises = data.days[0].exercises;
    // console.log(getExerciseName(1))

    return (
      <View >
        <PlanHeader name={data.name} />
        <PlanDays />
        <PlanExercises style={{flex:3}} exercises={exercises} />
      </View>
      
    )
  }
}

class PlanHeader extends PlanPage {
  render() {
    return (
      <View style={{height: 50, flex: 1, flexDirection: "row"}}>
        <PlanName name={this.props.name} />
        <PlanChangeButton />
        <CheatSheetButton />
      </View>
    )
  }
}

class PlanName extends PlanPage {
  render() {
    return (
      <View style={{flex: 3, backgroundColor: "steelblue"}}>
        <Text>{this.props.name}</Text>
      </View>
    )
  }
}

class PlanChangeButton extends PlanPage {
  render() {
    return (
      <View style={{flex: 2, backgroundColor: "powderblue"}}>
          <Text>|></Text>
        </View>
    )
  }
}

class CheatSheetButton extends PlanPage {
  render() {
    return (
      <View style={{flex: 1, backgroundColor: "skyblue"}}>
          <Text>?</Text>
        </View>
    )
  }
}

class PlanDays extends PlanPage {
  constructor(props) {
    super(props);
    // this.state = plansData[this.props.plan-1];
  }

  render() {

    return (
      <View style={{height: 40, flex: 1, flexDirection: "row"}}>
        <View style={styles.day}> 
          <Text>Day</Text>
        </View>
        <View style={styles.day}> 
          <Text>1</Text>
        </View>
        <View style={styles.day}> 
          <Text>2</Text>
        </View>
        <View style={styles.day}> 
          <Text>3</Text>
        </View>
      </View>
    )
  }
}

class PlanExercises extends PlanPage {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});

    this.state = {
      dataSource: ds.cloneWithRows(this.props.exercises)
    };
  }
  render() {

    return (
      <View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(exercise) => 
            <View>
              <View>
                <ExerciseName exercise={exercise} />
                <UnitChange exercise={exercise} />
              </View>
              

            </View>

          } 
        />
      </View>
    )
  }
}

class ExerciseName extends PlanPage {
  render() {
    let exercise = this.props.exercise;

    return (
      <Text>{getExerciseName(exercise.id)}</Text>
    )
  }
}

class UnitChange extends PlanPage {
  constructor(props) {
    super(props);

    console.log(this.props.exercise);

    this.state = this.props.exercise;
  }
  render() {
    return(
      <Text>{this.state.unit}</Text>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  day: {
    flex: 1
  }
});

AppRegistry.registerComponent('WorkoutTracker', () => WorkoutTracker);
