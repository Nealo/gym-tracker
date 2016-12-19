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
  Image,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';


import workoutData from '../../workout.json';

import styles from '../Helpers/Styles.js';

import Cheatsheet from './Cheatsheet';
import Video from './Video';
import Notes from './Notes';

Config = {
  deletePlanText: "Delete Plan",
  deleteExerciseText: "Delete Exercise",
  deleteDayText: "Delete Day",
  confirmDeleteText: "Are you sure?",

  planChangeText: "Change Plan",

  noteImage: '../Assets/Images/note.png',

  weightIncrements: [1,5],
}

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // indices of current items, not their IDs
      currentPlan: 0,
      currentDay: 0,
      currentExercise: 0,

      previousPlan: 0,

      plans: [],
      exercises: [],

      planModalVisible: false,
      planModalMessage: '',
      editExerciseModalVisible: false,
      addExerciseModalVisible: false,
      addExerciseModalMessage: '',
      dayModalVisible: false,
      dayModalMessage: '',
      introModalVisible: false,

      confirmDelete: false,
      deletePlanText: Config.deletePlanText,
      deleteExerciseText: Config.deleteExerciseText,
      deleteDayText: Config.deleteDayText,

      planChangeText: "Return",
    };
  }

  componentWillMount() {
    this._loadInitialState().done();
  }

  async _loadInitialState() {
    try {
      let plans = await AsyncStorage.getItem('plans');

      let exercises = await AsyncStorage.getItem('exercises')

      if (plans !== null && exercises !== null) {
        const currentDay = await AsyncStorage.getItem('currentDay');
        const currentPlan = await AsyncStorage.getItem('currentPlan');

        this.setState({
          plans: JSON.parse(plans),
          exercises: JSON.parse(exercises),
          currentPlan: currentPlan ? parseInt(currentPlan) : 0,
          currentDay: currentDay ? parseInt(currentDay) : 0
        });
      } else {
        this.setState({
          introModalVisible: true
        }, this.fetchDataFromServer(async (data) => {
            this.setState({
              exercises: data.exercises,
              plans: data.plans,

            });

            AsyncStorage.setItem('exercises', JSON.stringify(data.exercises));
            AsyncStorage.setItem('plans', JSON.stringify(data.plans));
            AsyncStorage.setItem('currentPlan', '0');
            AsyncStorage.setItem('currentDay', '0');
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  fetchDataFromServer(cb) {
    fetch(`https://www.julian.com/learn/muscle/workouts.json?${Date.now()}`, )
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res);
        cb(res);

      })
      .catch((error, x) => {
        console.log(error);
      });
  }

  createPickerItems(array) {
    return (array.map((item, index) =>
      <Picker.Item style={styles.pickerItem} key={index} label={(item.name).toString()} value={index} />
    ))
  }

  getExercise(id) {
    let exercise = {};

    this.state.exercises.forEach((exer) => {
      if (exer.id == id) {
        exercise = exer
      }
    })

    return exercise;
  }

  handlePlanPress() {
    this.setState({
      planModalVisible: true,
      previousPlan: this.state.currentPlan
    })
  }

  handleExercisePress(id) {
    let currentExercise = id;

    this.state.exercises.forEach((exercise, index) => {
      if (exercise.id == id) {
        currentExercise = index;
      }
    })
    this.setState({
      currentExercise: currentExercise,
      editExerciseModalVisible: true,
    });
  }
  handleDayPress() {
    this.setState({
      dayModalVisible: true,
    });
  }

  handlePlanChange(id) {
    let targetPlan = this.state.plans[id];
    let currentDay = this.state.currentDay;
    let planChangeText = Config.planChangeText;

    // if it's day 4 of current plan, and target plan only has 3 days, change current day to the first
    if (targetPlan.days.length >= currentDay) {
      currentDay = 0;
    }

    if (id == this.state.previousPlan) {
      planChangeText = "Return"
    }

    this.setState({
      planChangeText: planChangeText,
      currentPlan: id,
      currentDay: currentDay,
      confirmDelete: false,
      deletePlanText: Config.deletePlanText,
    });
    AsyncStorage.setItem('currentPlan', `${id}`);
    AsyncStorage.setItem('currentDay', `${currentDay}`);
  }
  handlePlanNameChange(e) {
    let plans = this.state.plans;

    plans[this.state.currentPlan].name = e.nativeEvent.text;

    this.setState({
      plans: plans
    });

    AsyncStorage.setItem('plans', JSON.stringify(this.state.plans))
  }
  handlePlanNew() {
    let newState = this.state;
    let plansLength = newState.plans.length
    // new ID is the most recent item's ID plus 1
    let planID  = newState.plans[plansLength-1].id + 1;
    let newPlan = {
      "id": planID,
      "name": "New Plan",
      "days": [
        {
          id: 0,
          name: "1",
          exercises: []
        },
        {
          id: 1,
          name: "2",
          exercises: []
        },
        {
          id: 2,
          name: "3",
          exercises: []
        }
      ]
    }

    this.setState({
      plans: newState.plans,
      currentPlan: plansLength,
      confirmDelete: false,
      deletePlanText: Config.deletePlanText,
      planChangeText: Config.planChangeText,
    })
    AsyncStorage.setItem('plans', JSON.stringify(newState.plans));
    AsyncStorage.setItem('currentPlan', `${plansLength}`);
  }
  handlePlanDelete(id) {
    if (!this.state.confirmDelete) {
      this.setState({
        confirmDelete: true,
        deletePlanText: Config.confirmDeleteText,
      })
    } else {
      let newState = this.state;
      let name = newState.plans[newState.currentPlan].name;
      let newPlanIndex = newState.plans.length - 1;

      newState.plans.splice(newState.currentPlan, 1)

      this.setState({
        plans: newState.plans,
        currentPlan: newPlanIndex,
        confirmDelete: false,
        deletePlanText: Config.deletePlanText,
        planModalMessage: `"${name}" deleted.`,
      })
      AsyncStorage.setItem('plans', JSON.stringify(newState.plans));
      AsyncStorage.setItem('currentPlan', `${newPlanIndex}`);
    }
  }

  handleDayNew() {
    let newState = this.state;

    let plan = newState.plans[newState.currentPlan];
    let daysLength = plan.days.length;

    if (daysLength >= 4) {
      this.setState({
        dayModalMessage: "The maximum days per plan are 4."
      });
    } else {
      let dayID = plan.days[daysLength-1].id + 1;

      let newDay = {
        id: dayID,
        name: (daysLength+1).toString(),
        exercises: []
      }

      this.setState({
        plans: newState.plans,
        currentDay: daysLength,
        dayModalMessage: '',
      })
      AsyncStorage.setItem('plans', JSON.stringify(newState.plans));
      AsyncStorage.setItem('currentDay', `${daysLength}`);
    }
  }

  handleDayDelete() {
    let newState = this.state;

    let plan = newState.plans[newState.currentPlan];
    let daysLength = plan.days.length;

    if (daysLength <= 2) {
      this.setState({
        dayModalMessage: "The minimum days per plan are 2."
      })
    } else {
      if (!this.state.confirmDelete) {
        this.setState({
          confirmDelete: true,
          deleteDayText: Config.confirmDeleteText,
        })
      } else {
        newState.plans[newState.currentPlan].days.splice(newState.currentDay, 1);

        this.setState({
          plans: newState.plans,
          currentDay: 0,
          dayModalMessage: '',
          deleteDayText: Config.deleteDayText,
          confirmDelete: false,
        })
        AsyncStorage.setItem('plans', JSON.stringify(newState.plans));
        AsyncStorage.setItem('currentDay', '0');
      }  // confirmDelete
    } // daysLength <= 2
  }
  handleDayChange(day) {
    this.setState({
      currentDay: day,
      deleteDayText: Config.deleteDayText,
      confirmDelete: false,
    });
    AsyncStorage.setItem('currentDay', `${day}`);
  }
  handleDayNameChange(e) {
    let newState = this.state;

    newState.plans[newState.currentPlan].days[newState.currentDay].name = e.nativeEvent.text;

    this.setState({
      plans: newState.plans,
      deleteDayText: Config.deleteDayText,
      confirmDelete: false,
    });
    AsyncStorage.setItem('plans', JSON.stringify(newState.plans));
  }

  handleExerciseChange(id) {
    this.setState({
      confirmDelete: false,
      deleteExerciseText: Config.deleteExerciseText,
      currentExercise: id
    });
  }
  handleExerciseNameChange(id, e) {
    let newState = this.state;

    newState.exercises.forEach((exercise, index) => {
      if (exercise.id === id) {
        newState.exercises[index].name = e.nativeEvent.text;
      }
    });

    this.setState({
      exercises: newState.exercises,
    })
    AsyncStorage.setItem('exercises', JSON.stringify(newState.exercises));
  }
  handleExerciseVideoChange(id, e) {
    let newState = this.state;
    let url = e.nativeEvent.text.replace('http://', 'https://');

    if (url === 'https:/') {
      return null;
    } else {
      if (url.slice(0,8) !== 'https://') {
        url = 'https://' + url;
      }

      newState.exercises.forEach((exercise, index) => {
        if (exercise.id === id) {
          newState.exercises[index].video = url;
        }
      })

      this.setState({
        exercises: newState.exercises,
      })
      AsyncStorage.setItem('exercises', JSON.stringify(newState.exercises));
    }


  }

  handleExerciseRemove(id, e) {
    // Remove exercise from a plan
    let newState = this.state;

    newState.plans[newState.currentPlan].days[newState.currentDay].exercises.forEach((exercise, index) => {
      if (exercise.id === id) {
        newState.plans[newState.currentPlan].days[newState.currentDay].exercises.splice(index, 1);
      }
    });

    this.setState({
      plans: newState.plans,
      editExerciseModalVisible: false,
      confirmDelete: false,
      deleteExerciseText: Config.deleteExerciseText,
      currentExercise: 0,
    })
    AsyncStorage.setItem('plans', JSON.stringify(newState.plans))
  }
  handleExerciseDelete(id) {
    if (!this.state.confirmDelete) {
      this.setState({
        confirmDelete: true,
        deleteExerciseText: Config.confirmDeleteText,
      })
    } else {
      // Delete exercise globally
      let newState = this.state;
      let name = '';

      // remove exercise from list of exercises
      newState.exercises.forEach((exercise, index) => {
        if (exercise.id === id) {
          name = this.getExercise(exercise.id).name;
          newState.exercises.splice(index, 1);
        }
      });

      // remove exercise from all plans
      newState.plans.forEach((plan, planIndex) => {
        plan.days.forEach((day, dayIndex) => {
          day.exercises.forEach((exercise, exerciseIndex) => {
            if (exercise.id === id) {
              newState.plans[planIndex].days[dayIndex].exercises.splice(exerciseIndex, 1);
            }
          });
        });
      });

      this.setState({
        plans: newState.plans,
        exercises: newState.exercises,
        confirmDelete: false,
        deleteExerciseText: Config.deleteExerciseText,
        currentExercise: 0,
        addExerciseModalMessage: `"${name}" deleted.`,
        editExerciseModalVisible: false,
      })
      AsyncStorage.setItem('plans', JSON.stringify(newState.plans));
      AsyncStorage.setItem('exercises', JSON.stringify(newState.exercises));
    }
  }
  handleExerciseNew() {
    // Create new global exercise
    let newState = this.state;
    let exercisesLength = newState.exercises.length;

    // new ID will be the most recent exercise's ID + 1
    let newID = parseInt(newState.exercises[exercisesLength-1].id + 1);

    newState.exercises[exercisesLength] = {
      id: newID,
      name: "New Exercise",
      video: "https://"
    }

    this.setState({
      exercises: newState.exercises,
      currentExercise: exercisesLength,
      confirmDelete: false,
      deleteExerciseText: Config.deleteExerciseText,
      addExerciseModalMessage: "New exercise created!",
    })
    AsyncStorage.setItem('exercises', JSON.stringify(newState.exercises));
  }
  handleExerciseAdd(id) {

    // Add exercise to a plan
    let newState = this.state;
    let allowAdd = true;

    newState.plans[newState.currentPlan].days[newState.currentDay].exercises.forEach((exercise, index) => {
      if (exercise.id == id) {
        allowAdd = false
      }
    });

    if (!allowAdd) {
      this.setState({
        addExerciseModalMessage: `"${this.getExercise(id).name}" is already added to this plan's day. Choose another exercise.`,
      });
    } else {
      let exerciseLength = newState.plans[newState.currentPlan].days[newState.currentDay].exercises.length;

      let newExercise = {
        id: id,
        weight: 0,
        sets: 3,
        unit: "lb"
      }

      newState.plans[newState.currentPlan].days[newState.currentDay].exercises.push(newExercise);

      this.setState({
        plans: newState.plans,
        addExerciseModalMessage: `"${this.getExercise(id).name}" added to plan.`,
        confirmDelete: false,
        deleteExerciseText: Config.deleteExerciseText,
      })
      AsyncStorage.setItem('plans', JSON.stringify(newState.plans));
    }
  }

  handleUnitChange(id, e) {
    let newState = this.state;

    newState.plans[newState.currentPlan].days[newState.currentDay].exercises[id].unit = newState.plans[newState.currentPlan].days[newState.currentDay].exercises[id].unit === "lb" ? "kg" : "lb";

    this.setState({
      plans: newState.plans,
    })
    AsyncStorage.setItem('plans', JSON.stringify(newState.plans));
  }
  handleWeightChange(id, e) {
    let newState = this.state;
    // Handle blank input
    let newWeight = e.nativeEvent.text ? e.nativeEvent.text : '';
    // Only parse if not blank

    if (newWeight) {
      if (newWeight.slice(-1) === '.') {
      } else {
        newWeight = parseFloat(newWeight);
      }

    } else {
      // Keeps from starting with a non-number
      newWeight = '';
    }

    newWeight = newWeight ? newWeight : '';

    newState.plans[newState.currentPlan].days[newState.currentDay].exercises[id].weight = newWeight;

    this.setState({
      plans: newState.plans,
    })
    AsyncStorage.setItem('plans', JSON.stringify(newState.plans));
  }
  handleSetChange(id, e) {
    let newState = this.state;
    let newSets = e.nativeEvent.text ? e.nativeEvent.text : '';

    newSets = newSets ? parseInt(newSets) : newSets;
    newSets = newSets ? newSets : '';

    newState.plans[newState.currentPlan].days[newState.currentDay].exercises[id].sets = newSets;

    this.setState({
      plans: newState.plans,
    })
    AsyncStorage.setItem('plans', JSON.stringify(newState.plans));
  }
  handleWeightIncrement(id, increment) {
    let newState = this.state;
    let exercise = newState.plans[this.state.currentPlan].days[newState.currentDay].exercises[id];
    let newWeight = exercise.weight;


    newState.plans[newState.currentPlan].days[newState.currentDay].exercises[id].weight = parseFloat((newWeight + increment).toFixed(2));

    this.setState({
      plans: newState.plans,
    })
    AsyncStorage.setItem('plans', JSON.stringify(newState.plans));
  }

  renderExerciseFooter() {
    return (
      <View style={styles.exerciseSectionFooter}>
        <TouchableHighlight
          style={[styles.buttonCreate, styles.button]}
          onPress={() => this.setState({addExerciseModalVisible: true})} >
            <Text style={styles.buttonText}>Add New Exercise</Text>
        </TouchableHighlight>
      </View>
    );
  }
  renderExerciseRow(exercise, section, row) {
    let weightIncrements = Config.weightIncrements.map((inc, index) => {
      return (
        <View key={index} style={styles.weightIncrementBox}>
          <TouchableHighlight
            style={styles.weightIncrement}
            onPress={(event) => this.handleWeightIncrement(row, inc)} >
            <Text>+{inc}</Text>
          </TouchableHighlight>
        </View>
      )
    });

    return (
      <View style={styles.exerciseRow}>
        <View style={styles.exerciseHead}>
          <View style={styles.exerciseName}>
            <TouchableHighlight
              onPress={(event) => this.handleExercisePress(exercise.id)} >
              <Text style={styles.exerciseNameText}>
                {this.getExercise(exercise.id).name}
              </Text>
            </TouchableHighlight>
          </View>

          <VideoLink exercise={this.getExercise(exercise.id)} navigator={this.props.navigator} />

        </View>
        <View style={styles.exerciseBody}>
          {/*Weight Display*/}
          <View style={styles.weightDisplay}>
            <TextInput
              style={styles.weightDisplayInput}
              maxLength={5}
              selectTextOnFocus={true}
              keyboardType='numeric'
              value={exercise.weight.toString()}
              onChange={(event) => this.handleWeightChange(row, event)} />
          </View>
          {/*Set Display*/}
            <TouchableHighlight
              style={styles.unitChange}
              onPress={(event) => this.handleUnitChange(row, event)}>
              <Text style={styles.unitText}>{exercise.unit}</Text>
            </TouchableHighlight>
          <View style={styles.setTimesWrap}>
            <Text style={styles.setTimes}>x</Text>
          </View>
          <TextInput
            style={styles.setDisplay}
            maxLength={2}
            selectTextOnFocus={true}
            keyboardType='numeric'
            value={exercise.sets.toString()}
            onChange={(event) => this.handleSetChange(row, event)} />
          {/*Weight Increments*/}
          <View style={styles.weightIncrements}>
            {weightIncrements}
          </View>
          {/*Weight Increments*/}
        </View>
      </View>
    );
  }

  render() {
    let {plans} = this.state;
    // AsyncStorage.removeItem('plans');
    // AsyncStorage.removeItem('exercises')

    if (plans.length == 0) {
      return (
        <View style={[styles.loading]}>
          <ActivityIndicator size="large" />
        </View>
      )
    } else {
      let { currentPlan, currentExercise, currentDay } = this.state;

      let plan = plans[currentPlan];

      let {exercises} = plan.days[currentDay];
      let exercisesAll = this.state.exercises;

      let ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
      let dataSource =  ds.cloneWithRows(exercises);

      return (
        <View style={styles.mainContainer}>

          {/*Intro Modal*/}
          <ModalIntro />

          {/*Plan Modal*/}
          <Modal
            animationType={'slide'}
            visible={this.state.planModalVisible}
            transparent={false}
            onRequestClose={() => {}} >
            <ScrollView style={[styles.planModal, styles.modal]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderText}>Edit & Change Plans</Text>
              </View>
              <View style={[styles.modalPickerBox, styles.mask]}>
                <Picker
                  style={styles.modalPicker}
                  mode="dropdown"
                  selectedValue={currentPlan}
                  onValueChange={(id) => this.handlePlanChange(id)}
                  >
                  {this.createPickerItems(plans)}
                </Picker>
              </View>

              <View style={styles.form}>
                <View style={styles.formRow}>
                  <Text style={styles.label}>Plan Name</Text>
                  <TextInput
                    style={{padding: 10, height: 40, borderColor: 'gray', borderWidth: 1}}
                    value={plan.name}
                    onChange={this.handlePlanNameChange.bind(this)} />
                  </View>
              </View>

              <View style={styles.modalMessage}>
                <Text>{this.state.planModalMessage}</Text>
              </View>
              <View style={styles.modalFooter}>
                <TouchableHighlight
                  style={[styles.buttonExit, styles.button]}
                  onPress={() => this.setState({planModalVisible: false, confirmDelete: false, deletePlanText: Config.deletePlanText, planModalMessage: '', planChangeText: 'Return'})} >
                  <Text style={styles.buttonText}>{this.state.planChangeText}</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={[styles.buttonCreate, styles.button]}
                  onPress={() => this.handlePlanNew()}>
                  <Text style={styles.buttonText}>Create New Plan</Text>
                </TouchableHighlight>
              </View>
              <View style={styles.modalBottom}>
                <TouchableHighlight
                  style={[styles.buttonDelete, styles.button]}
                  onPress={() => this.handlePlanDelete()} >
                  <Text style={styles.buttonText}>{this.state.deletePlanText}</Text>
                </TouchableHighlight>
              </View>
            </ScrollView>
          </Modal>
          {/*Add Exercise Modal*/}
          <Modal
            animationType={'slide'}
            visible={this.state.addExerciseModalVisible}
            transparent={false}
            onRequestClose={() => {}} >
            <ScrollView style={[styles.addExerciseModal, styles.modal]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderText}>Create & Add Exercises</Text>
              </View>
              <View style={[styles.modalPickerBox, styles.mask]}>
                <Picker
                  style={styles.modalPicker}
                  mode="dropdown"
                  selectedValue={currentExercise}
                  onValueChange={(id) => this.handleExerciseChange(id)}
                  >
                  {this.createPickerItems(exercisesAll)}
                </Picker>
              </View>
              <View style={styles.form}>
                <View style={styles.formRow}>
                  <Text style={styles.label}>Exercise Name</Text>
                  <TextInput
                    style={{padding: 10, height: 40, borderColor: 'gray', borderWidth: 1}}
                    value={exercisesAll[currentExercise].name}
                    onChange={(event) => this.handleExerciseNameChange(exercisesAll[currentExercise].id, event)} />
                  </View>
                  <View style={styles.formRow}>
                    <Text style={styles.label}>Video Link</Text>
                    <TextInput
                      style={{padding: 10, height: 40, borderColor: 'gray', borderWidth: 1}}
                      value={exercisesAll[currentExercise].video}
                      onChange={(event) => this.handleExerciseVideoChange(exercisesAll[currentExercise].id, event)} />
                    </View>
              </View>
              <View style={styles.modalMessage}>
                <Text>{this.state.addExerciseModalMessage}</Text>
              </View>
              <View style={styles.modalFooter}>
                <TouchableHighlight
                  style={[styles.buttonAdd, styles.button]}
                  onPress={() => this.handleExerciseAdd(exercisesAll[currentExercise].id)} >
                  <Text style={styles.buttonText}>Add Exercise to Plan</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={[styles.buttonExit, styles.button]}
                  onPress={() => this.setState({addExerciseModalVisible: false, addExerciseModalMessage: '', currentExercise: 0, confirmDelete: false, deleteExerciseText: Config.deleteExerciseText})} >
                  <Text style={styles.buttonText}>Back to Plan</Text>
                </TouchableHighlight>
              </View>
              <View style={styles.modalBottom}>
                <TouchableHighlight
                  style={[styles.buttonCreate, styles.button]}
                  onPress={() => this.handleExerciseNew()}>
                  <Text style={styles.buttonText}>Create New Exercise</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={[styles.buttonDelete, styles.button]}
                  onPress={() => this.handleExerciseDelete(currentExercise)} >
                  <Text style={styles.buttonText}>{this.state.deleteExerciseText}</Text>
                </TouchableHighlight>
              </View>
            </ScrollView>
          </Modal>
          {/*Edit Exercise Modal*/}
          <Modal
            animationType={'slide'}
            visible={this.state.editExerciseModalVisible}
            transparent={false}
            onRequestClose={() => {}} >
            <ScrollView style={[styles.exerciseModal, styles.modal]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderText}>Edit Exercise</Text>
              </View>

              <View style={styles.form}>
                <View style={styles.formRow}>
                  <Text style={styles.label}>Exercise Name</Text>
                  <TextInput
                    style={{padding: 10, height: 40, borderColor: 'gray', borderWidth: 1}}
                    value={exercisesAll[currentExercise].name}
                    onChange={(e) => this.handleExerciseNameChange(exercisesAll[currentExercise].id, e)} />
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.label}>Video Link</Text>
                  <TextInput
                    style={{padding: 10, height: 40, borderColor: 'gray', borderWidth: 1}}
                    value={exercisesAll[currentExercise].video}
                    onChange={(e) => this.handleExerciseVideoChange(exercisesAll[currentExercise].id, e)} />
                  </View>
              </View>

              <View style={styles.modalFooter}>
                <TouchableHighlight
                  style={[styles.buttonExit, styles.button]}
                  onPress={() => this.setState({editExerciseModalVisible: false, currentExercise: 0, deleteExerciseText: Config.deleteExerciseText})} >
                  <Text style={styles.buttonText}>Back to Plan</Text>
                </TouchableHighlight>
              </View>
              <View style={styles.modalBottom}>
                <TouchableHighlight
                  style={[styles.buttonRemove, styles.button]}
                  onPress={(e) => this.handleExerciseRemove(exercisesAll[currentExercise].id, e)} >
                  <Text style={styles.buttonText}>Remove Exercise from Plan</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={[styles.buttonDelete, styles.button]}
                  onPress={() => this.handleExerciseDelete(currentExercise)} >
                  <Text style={styles.buttonText}>{this.state.deleteExerciseText}</Text>
                </TouchableHighlight>
              </View>
            </ScrollView>
          </Modal>
          {/*Day Modal*/}
          <Modal
            animationType={'slide'}
            visible={this.state.dayModalVisible}
            transparent={false}
            onRequestClose={() => {}} >
            <ScrollView style={[styles.dayModal, styles.modal]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderText}>Add & Delete Days</Text>
              </View>
              <View style={[styles.modalPickerBox, styles.mask]}>
                <Picker
                  style={styles.modalPicker}
                  mode="dropdown"
                  selectedValue={currentDay}
                  onValueChange={(id) => this.handleDayChange(id)}
                  >
                  {this.createPickerItems(plan.days)}
                </Picker>
              </View>

              <View style={styles.form}>
                <View style={styles.formRow}>
                  <Text style={styles.label}>Identifier (1 character)</Text>
                  <TextInput
                    style={{padding: 10, height: 40, borderColor: 'gray', borderWidth: 1}}
                    maxLength={1}
                    value={plan.days[currentDay].name}
                    onChange={(e) => this.handleDayNameChange(e)} />
                </View>

              </View>

              <View style={styles.modalMessage}>
                <Text>{this.state.dayModalMessage}</Text>
              </View>

              <View style={styles.modalFooter}>
                <TouchableHighlight
                  style={[styles.buttonExit, styles.button]}
                  onPress={() => this.setState({dayModalVisible: false, dayModalMessage: '', deleteDayText: Config.deleteDayText, confirmDelete: false })} >
                  <Text style={styles.buttonText}>Back to Plan</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={[styles.buttonCreate, styles.button]}
                  onPress={() => this.handleDayNew()} >
                  <Text style={styles.buttonText}>Create New Day</Text>
                </TouchableHighlight>
              </View>
              <View style={styles.modalBottom}>

                <TouchableHighlight
                  style={[styles.buttonDelete, styles.button]}
                  onPress={() => this.handleDayDelete()} >
                  <Text style={styles.buttonText}>{this.state.deleteDayText}</Text>
                </TouchableHighlight>
              </View>
            </ScrollView>
          </Modal>

          {/*Header Section*/}
          {/*<Header
            plan={plan}
            navigator={this.props.navigator}
            routes={this.props.routes}
            handlePlanPress={this.handlePlanPress.bind(this)} />*/}
          <View style={styles.header}>
            <View style={styles.headerPlan}>
                <TouchableHighlight
                  onPress={() => this.handlePlanPress()}
                >
                  <Text style={styles.planName}>{plan.name}</Text>
                </TouchableHighlight>
            </View>

            <NoteLink navigator={this.props.navigator} routes={this.props.routes} />
            <CheatSheetLink navigator={this.props.navigator} routes={this.props.routes} />
          </View>

          {/*Day Section*/}
          <DaySection
            days={plan.days} handleDayPress={this.handleDayPress.bind(this)}
            handleDayChange={this.handleDayChange.bind(this)}
            currentDay={currentDay} />

          {/*Exercise Section*/}
          <View style={styles.exerciseSection}  >
            <ListView
              dataSource={dataSource}
              automaticallyAdjustContentInsets={false}
              renderFooter={() =>
                this.renderExerciseFooter()
              }
              renderRow={(exercise, section, row) =>
                this.renderExerciseRow(exercise, section, row)
              }
            />
            {/*ListView*/}
          </View>
          {/*{this.renderScrollIndicator()}*/}

        </View>
      ); // return

    }


  }
}

class Header extends Main {
  constructor(props) {
    super(props);
  }

  render() {
    let plan = this.props.plan;

    return (
      <View style={styles.header}>
        <View style={styles.headerPlan}>
            <TouchableHighlight
              onPress={() => this.handlePlanPress()}
            >
              <Text style={styles.planName}>{plan.name}</Text>
            </TouchableHighlight>
        </View>

        <NoteLink navigator={this.props.navigator} routes={this.props.routes} />
        <CheatSheetLink navigator={this.props.navigator} routes={this.props.routes} />
      </View>
    );
  }
}

class DaySection extends React.Component {
  constructor(props) {
    super(props);
  }

  createHeaderDays(days) {
    return (
      days.map((day, index) => {
        let dayTextStyles = [styles.dayText, styles.dayButton];
        if (day.exercises.length == 0) {
            dayTextStyles.push(styles.dayEmpty)
        }

        if (index === this.props.currentDay) {
          dayTextStyles.push(styles.dayCurrent);
        }

        return (
          <TouchableHighlight
            key={day.id}
            onPress={() => this.props.handleDayChange(index)}
            style={styles.dayView}
          >
            <View>
              <Text style={dayTextStyles}>
                {day.name}
              </Text>
            </View>
          </TouchableHighlight>
        )
      })
    );
  }

  render() {
    return (
      <View style={styles.daySection}>
        <View style={[styles.dayView,styles.dayMain]}>
          <TouchableHighlight
            onPress={this.props.handleDayPress} >
            <Text style={[styles.dayText, styles.dayMainText]}>
              Day
            </Text>
          </TouchableHighlight>
        </View>
        {this.createHeaderDays(this.props.days)}
      </View>
    )
  }
}

class VideoLink extends React.Component {
  constructor (props) {
    super(props);
  }

  handleVideoPress(exercise) {
    // let exerciseID  = this.state.plans[this.state.currentPlan].days[this.state.currentDay].exercises[row].id;
    // let exercise = {};
    //
    // this.state.exercises.forEach((eachExercise) => {
    //   if (eachExercise.id === exerciseID) {
    //     exercise = eachExercise
    //   }
    // });

    let uri = exercise.video;
    let title = exercise.name + " video"

    if (Platform.OS == 'ios') {
      this.props.navigator.push({
        title: title,
        component: Video,
        passProps: {
          exercise: exercise,
          uri: uri
        }
      });
    } else {
      this.props.navigator.push({
        title: title,
        index: 3,
        passProps: {
          exercise: exercise,
          uri: uri
        }
      });
    }
  }

  render() {
    return (

      <View style={styles.videoLink}>
        <TouchableHighlight

          onPress={() => this.handleVideoPress(this.props.exercise)}>
          <Image
            style={styles.videoImage}
            source={require('../Assets/Images/video.png')}
          />
        </TouchableHighlight>
      </View>
    );
  }
}

class NoteLink extends React.Component {
  constructor (props) {
    super(props);
  }

  handleNotesPress() {
    if (Platform.OS == 'ios') {
      this.props.navigator.push({
        title: "Notes",
        component: Notes
      });
    } else {
      this.props.navigator.push(this.props.routes[1]);
    }

  }

  render() {
    return (
      <View style={styles.headerExtra}>
        <TouchableHighlight
          onPress={() => this.handleNotesPress()}
        >
          <Image
            style={styles.noteImage}
            source={require('../Assets/Images/note.png')} />
        </TouchableHighlight>
      </View>
    );
  }
}

class CheatSheetLink extends React.Component {
  constructor (props) {
    super(props);
  }

  handleCheatsheetPress() {
    if (Platform.OS == 'ios') {
      this.props.navigator.push({
        title: "Cheat Sheet",
        component: Cheatsheet
      });
    } else {
      this.props.navigator.push({
        title: "Cheatsheet",
        index: 2,
        renderScene: () =>
          <Cheatsheet />
      })
    }
  }

  render() {
    return (
      <View style={styles.headerExtra}>
        <TouchableHighlight
          onPress={() => this.handleCheatsheetPress()} >
          <Text style={styles.headerExtraText}>?</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

class ModalIntro extends Main {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal
        animationType={'slide'}
        visible={this.state.introModalVisible}
        transparent={false}
        onRequestClose={() => {}} >
        <View style={[styles.modal, styles.introModal]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}>Welcome!</Text>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.modalListItem}>This app consists of workout plans. Each plan has 1-3 days worth of exercises to do in a week.</Text>
            <Text style={styles.modalListItem}>For each exercise, this app lets you track how much weight you’re lifting.</Text>
            <Text style={styles.modalListItem}>Everything in the main screen is clickable and changeable — the plan, workout days, exercises, video links, sets, and even lb/kg. So fool around and customize everything to your desire.</Text>
            <Text style={styles.modalListItem}>You can view the Julian.com Muscle cheat sheet by clicking the question mark in the top right of the main screen.</Text>

          </View>
          <View style={styles.modalFooter}>
            <TouchableHighlight
              style={[styles.buttonExit, styles.button]}
              onPress={() => this.setState({introModalVisible: false})}
              >
              <Text style={styles.buttonText}>Start Tracking</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    )
  }
}

// class ModalPlan extends Main {
//   constructor(props) {
//     super(props);
//   }
// }
//
// class ModalDay extends Main {
//   constructor(props) {
//     super(props);
//   }
// }
//
// class ModalExerciseEdit extends Main {
//   constructor(props) {
//     super(props);
//   }
// }
//
// class ModalExerciseAdd extends Main {
//   constructor(props) {
//     super(props);
//   }
// }

module.exports = Main;
