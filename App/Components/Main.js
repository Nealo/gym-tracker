import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ListView,
  TouchableHighlight,
  Picker,
  Modal,
  AsyncStorage,
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
      // currentExercise: 0,
      plans: plansData,
      exercises: exerciseData,
      planModalVisible: false
      // error: false,
    };
  }

  componentDidMount() {
    this._loadInitialState().done();
  }

  async _loadInitialState() {
    try {
      var plans = await AsyncStorage.getItem('plans');
      let exercises = await AsyncStorage.getItem('exercises')

      if (plans !== null && exercises !== null) {
        this.setState({plans: JSON.parse(plans), exercises: JSON.parse(exercises)});
      } else {
        console.log("null");
      }
    } catch (error) {
      console.log(this.state);
      console.log(error);
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

  handlePlanChange(id) {
    let targetPlan = this.state.plans[id];
    let currentDay = this.state.currentDay

    // if it's day 4 of current plan, and target plan only has 3 days, change current day to the first
    if (targetPlan.days.length >= currentDay) {
      currentDay = 0;
    }
    this.setState({
      currentPlan: id,
      currentDay: currentDay
    });
  }
  handlePlanNameChange(e) {
    let newPlan = this.state.plans[this.state.currentPlan];
    newPlan.name = e.nativeEvent.text;

    this.setState({
      plan: newPlan
    });
    AsyncStorage.setItem('plans', JSON.stringify(this.state.plans))
  }
  handleNewPlan() {
    let newState = this.state;
    let planID  = newState.plans.length;
    let newPlan = {
      "id": planID,
      "name": "New Plan",
      "days": [
        {
          id: 0,
          exercises: []
        },
        {
          id: 1,
          exercises: []
        },
        {
          id: 2,
          exercises: []
        }
      ]
    }

    newState.plans.push(newPlan);
    newState.currentPlan = planID;

    this.setState(newState);
    AsyncStorage.setItem('plans', JSON.stringify(newState.plans));
  }
  handleNewDay() {
    let newState = this.state;
    let plan = newState.plans[newState.currentPlan];
    let dayID = plan.days.length;

    let newDay = {
      id: dayID,
      exercises: []
    }

    newState.plans[newState.currentPlan].days.push(newDay);
    newState.currentDay = dayID;

    this.setState(newState);
    AsyncStorage.setItem('plans', JSON.stringify(newState.plans));
  }

  handleDayPress(day) {
    let newState = this.state;
    newState.currentDay = day;

    this.setState(newState)
  }

  handleExerciseChange(id) {
    this.setState({
      currentExercise: id
    });
  }
  handleExerciseNameChange(id, e) {
    let newState = this.state;
    newState.exercises[id].name = e.nativeEvent.text;
    this.setState(newState);
    AsyncStorage.setItem('exercises', JSON.stringify(newState.exercises));
  }
  handleExerciseVideoChange(id, e) {
    let newState = this.state;
    newState.exercises[id].video = e.nativeEvent.text;

    this.setState(newState);
    AsyncStorage.setItem('exercises', JSON.stringify(newState.exercises));
  }
  handleUnitChange(id, e) {
    let newState = this.state;

    newState.plans[newState.currentPlan].days[newState.currentDay].exercises[id].unit = newState.plans[newState.currentPlan].days[newState.currentDay].exercises[id].unit === "lb" ? "kg" : "lb";

    this.setState(newState);
    AsyncStorage.setItem('plans', JSON.stringify(newState.plans));
  }
  handleWeightChange(id, e) {
    let newState = this.state;
    // Handle blank input
    let newWeight = e.nativeEvent.text ? e.nativeEvent.text : '';
    // Only parse if not blank
    newWeight = newWeight ? parseFloat(newWeight) : newWeight;
    // Keeps from starting with a non-number
    newWeight = newWeight ? newWeight : '';

    newState.plans[newState.currentPlan].days[newState.currentDay].exercises[id].weight = newWeight;

    this.setState(newState);
    AsyncStorage.setItem('plans', JSON.stringify(newState.plans));
  }
  handleSetChange(id, e) {
    let newState = this.state;
    let newSets = e.nativeEvent.text ? e.nativeEvent.text : '';

    newSets = newSets ? parseInt(newSets) : newSets;
    newSets = newSets ? newSets : '';

    newState.plans[newState.currentPlan].days[newState.currentDay].exercises[id].sets = newSets;

    this.setState(newState);
    AsyncStorage.setItem('plans', JSON.stringify(newState.plans));
  }
  handleWeightIncrement(id, heavy) {
    let newState = this.state;
    let exercise = newState.plans[this.state.currentPlan].days[newState.currentDay].exercises[id];
    let newWeight = exercise.weight;
    let increment = 1;

    if (heavy) {
      increment = exercise.unit === "lb" ? 5 : 2.27;;
    }

    newState.plans[newState.currentPlan].days[newState.currentDay].exercises[id].weight = parseFloat((newWeight + increment).toFixed(2));

    this.setState(newState);
  }

  handleAddExercise(id, e) {
    let newState = this.state;
    let exerciseLength = newState.plans[newState.currentPlan].days[newState.currentDay].exercises.length;
    let newID = this.state.exercises.length;

    newState.exercises[newID] = {
      id: newID,
      name: "New Exercise",
      video: ""
    }

    newState.plans[newState.currentPlan].days[newState.currentDay].exercises[exerciseLength] = {
      id: newID,
      weight: 50,
      sets: 3,
      unit: "lb"
    }

    // scroll to bottom of list view

    this.setState(newState);
    AsyncStorage.setItem('plans', JSON.stringify(newState.plans));
    AsyncStorage.setItem('exercises', JSON.stringify(newState.exercises));

  }

  render() {
    let plans = this.state.plans;
    let currentPlan = this.state.currentPlan;
    let plan = plans[currentPlan];

    let currentDay = this.state.currentDay;
    let exercises = plan.days[currentDay].exercises;

    // let exercisesAll = this.state.exercises;

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

    let planPickerItems = plans.map((plan) =>
      <Picker.Item style={styles.pickerItem} key={plan.id} label={plan.name} value={plan.id} />
    );

    // let exercisePickerItems = exercisesAll.map((exercise) =>
    //   <Picker.Item style={styles.pickerItem} key={exercise.id} label={exercise.name} value={exercise.id} />
    // );

    return (
      <View style={styles.mainContainer}>
        {/*Header Section*/}

        <Modal
          animationType={'slide'}
          visible={this.state.planModalVisible}
          transparent={false}
          >
          <Text>Edit & Change Plans</Text>
          <Picker
            mode="dropdown"
            selectedValue={plans[currentPlan].id}
            onValueChange={(id) => this.handlePlanChange(id)}
            >
            {planPickerItems}
          </Picker>

          <View>
            <TextInput
              style={{padding: 10, height: 40, borderColor: 'gray', borderWidth: 1}}
              value={plan.name}
              onChange={this.handlePlanNameChange.bind(this)} />
          </View>
          <TouchableHighlight
            onPress={() => this.handleNewPlan()}>
            <Text>Create New Plan</Text>
          </TouchableHighlight>

          <TouchableHighlight
            onPress={() => this.setState({planModalVisible: false})} >

            <Text>Close Modal</Text>
          </TouchableHighlight>
        </Modal>

        <View style={styles.header}>
          <View style={{padding: 5, flex: 3}}>
              <TouchableHighlight
                onPress={() => this.setState({planModalVisible: true})}
              >
                <Text style={styles.planName}>{plan.name}</Text>
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

// class ModalPlan extends Main {
//   constructor(props) {
//     super(props);
//
//     this.state = {
//       animationType: 'slide',
//       modalVisible: false,
//       transparent: true
//     }
//   }
//
//   render() {
//     let plans = this.props.plans;
//
//     let pickerItems = plans.map((plan) =>
//       <Picker.Item key={plan.id} label={plan.name} value={plan.id} />
//     );
//
//     return (
//       <Modal
//         animationType={this.state.animationType}
//         visible={this.state.modalVisible}
//         transparent={this.state.transparent}
//         >
//         <Picker
//           mode="dropdown"
//           selectedValue={plans[currentPlan].id}
//           onValueChange={(id) => this.handlePlanChange(id)}
//           >
//           {pickerItems}
//         </Picker>
//
//       </Modal>
//     );
//   }
// }

const styles = StyleSheet.create({
  header: {
    // height: 50,
    flex: 1,
    flexDirection: "row",
  },
  mainContainer: {
    flex: 1,
    marginTop: 65,
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
    flex: 1,
    padding: 10,
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
