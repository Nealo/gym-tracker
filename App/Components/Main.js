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

class Main extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      // indices of current items, not their IDs
      currentPlan: 0,
      currentDay: 0,
      currentExercise: 0,

      previousPlan: 0,

      plans: workoutData.plans,
      exercises: workoutData.exercises,

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

      // TO DO: CHANGE TO FALSE, CONFIRM IT WORKS ON FIRST LOAD
      showScrollIndicator: true,

      planChangeText: "Return",
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
        // this.setState({
        //   introModalVisible: true
        // });

        // console.log("null");
      }
    } catch (error) {
      console.log(this.state);
      console.log(error);
    }
  }

  toggleScrollIndicator() {
    console.log('hello');
    // this.setState({
    //   showScrollIndicator: !this.state.showScrollIndicator
    // })
  }

  renderScrollIndicator() {
    if (this.state.showScrollIndicator) {
      return (
        <View style={styles.scrollIndicator}>
          <Image
            style={styles.scrollIndicatorImage}
            source={require('../Assets/Images/arrow.png')} />
        </View>
      );
    } else {
      return null;
    }
  }

  createHeaderDays(days) {
    return (
      days.map((day, index) => {
        let dayTextStyles = [styles.dayText, styles.dayButton];
        if (day.exercises.length == 0) {
            dayTextStyles.push(styles.dayEmpty)
        }

        if (day.id === this.state.currentDay) {
          dayTextStyles.push(styles.dayCurrent);
        }

        return (
          <TouchableHighlight
            key={day.id}
            onPress={() => this.handleDayChange(day.id)}
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
  createPickerItems(array) {
    return (array.map((item, index) =>
      <Picker.Item style={styles.pickerItem} key={index} label={(item.name).toString()} value={index} />
    ))
  }
  getExerciseName(id) {
    let name = '';

    this.state.exercises.forEach((exercise) => {
      if (exercise.id == id) {
        name = exercise.name;
      }
    })

    return name;
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
  }
  handlePlanNameChange(e) {
    let newPlan = this.state.plans[this.state.currentPlan];
    newPlan.name = e.nativeEvent.text;

    this.setState({
      plan: newPlan
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

    newState.plans.push(newPlan);
    // current plan is the new plan's index
    newState.currentPlan = plansLength;
    newState.confirmDelete = false;
    newState.deletePlanText = Config.deletePlanText;
    newState.planChangeText = Config.planChangeText;

    this.setState(newState);
    AsyncStorage.setItem('plans', JSON.stringify(newState.plans));
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

      newState.plans.splice(newState.currentPlan, 1)

      newState.currentPlan = newState.plans.length - 1;
      newState.confirmDelete = false;
      newState.deletePlanText = Config.deletePlanText;
      newState.planModalMessage = `"${name}" deleted.`;

      this.setState(newState);
      AsyncStorage.setItem('plans', JSON.stringify(newState.plans));
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

      newState.plans[newState.currentPlan].days.push(newDay);
      newState.currentDay = daysLength;
      newState.dayModalMessage = '';

      this.setState(newState);
      AsyncStorage.setItem('plans', JSON.stringify(newState.plans));
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

        newState.currentDay = 0;
        newState.dayModalMessage = '';
        newState.deleteDayText = Config.deleteDayText;
        newState.confirmDelete = false;

        this.setState(newState);
        AsyncStorage.setItem('plans', JSON.stringify(newState.plans));
      }  // confirmDelete
    } // daysLength <= 2
  }
  handleDayChange(day) {
    let newState = this.state;
    newState.currentDay = day;
    console.log('meow');

    newState.deleteDayText = Config.deleteDayText;
    newState.confirmDelete = false;

    this.setState(newState);

    console.log(this.state);

  }
  handleDayNameChange(e) {
    let newState = this.state;

    newState.plans[newState.currentPlan].days[newState.currentDay].name = e.nativeEvent.text;
    newState.deleteDayText = Config.deleteDayText;
    newState.confirmDelete = false;

    this.setState(newState);
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

    this.setState(newState);
    AsyncStorage.setItem('exercises', JSON.stringify(newState.exercises));
  }
  handleExerciseVideoChange(id, e) {
    let newState = this.state;
    newState.exercises[id].video = e.nativeEvent.text;

    this.setState(newState);
    AsyncStorage.setItem('exercises', JSON.stringify(newState.exercises));
  }

  handleExerciseRemove(id, e) {
    // Remove exercise from a plan
    let newState = this.state;

    newState.plans[newState.currentPlan].days[newState.currentDay].exercises.forEach((exercise, index) => {
      if (exercise.id === id) {
        newState.plans[newState.currentPlan].days[newState.currentDay].exercises.splice(index, 1);
      }
    });

    newState.editExerciseModalVisible = false;
    newState.confirmDelete = false;
    newState.deleteExerciseText = Config.deleteExerciseText;
    newState.currentExercise = 0;

    this.setState(newState);
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
          name = this.getExerciseName(exercise.id);
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

      newState.confirmDelete = false;
      newState.deleteExerciseText = Config.deleteExerciseText;
      newState.currentExercise = 0;
      newState.addExerciseModalMessage = `"${name}" deleted.`;

      newState.editExerciseModalVisible = false;

      this.setState(newState);
      AsyncStorage.setItem('plans', JSON.stringify(newState.plans));
      AsyncStorage.setItem('exercises', JSON.stringify(newState.exercises));
    }
  }
  handleExerciseNew() {
    // Create new global exercise
    let newState = this.state;
    let exercisesLength = newState.exercises.length;

    // new ID will be the most recent exercise's ID + 1
    let newID = newState.exercises[exercisesLength-1].id + 1;

    newState.exercises[newID] = {
      id: newID,
      name: "New Exercise",
      video: ""
    }

    newState.currentExercise = exercisesLength;
    newState.confirmDelete = false;
    newState.deleteExerciseText = Config.deleteExerciseText;
    newState.addExerciseModalMessage = "New exercise created!";

    this.setState(newState);
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
        addExerciseModalMessage: `"${this.getExerciseName(id)}" is already added to this plan's day. Choose another exercise.`,
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
      newState.addExerciseModalMessage = `"${this.getExerciseName(id)}" added to plan.`
      newState.confirmDelete = false;
      newState.deleteExerciseText = Config.deleteExerciseText;

      this.setState(newState);
      AsyncStorage.setItem('plans', JSON.stringify(newState.plans));
    }
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
  handleWeightIncrement(id, increment) {
    let newState = this.state;
    let exercise = newState.plans[this.state.currentPlan].days[newState.currentDay].exercises[id];
    let newWeight = exercise.weight;


    newState.plans[newState.currentPlan].days[newState.currentDay].exercises[id].weight = parseFloat((newWeight + increment).toFixed(2));

    this.setState(newState);
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
    let weightIncrements = Config.weightIncrements.map((inc) => {
      return (
        <View style={styles.weightIncrementBox}>
          <TouchableHighlight
            style={styles.weightIncrement}
            onPress={(event) => this.handleWeightIncrement(row, inc)} >
            <Text>+{inc}</Text>
          </TouchableHighlight>
        </View>
      )
    })

    return (
      <View style={styles.exerciseRow}>
        <View style={styles.exerciseHead}>
          <View style={styles.exerciseName}>
            <TouchableHighlight
              onPress={(event) => this.handleExercisePress(exercise.id)} >
              <Text style={styles.exerciseNameText}>
                {this.getExerciseName(exercise.id)}
              </Text>
            </TouchableHighlight>
          </View>

          <VideoLink row={row} navigator={this.props.navigator} />

        </View>
        <View style={styles.exerciseBody}>
          {/*Weight Display*/}
          <View style={styles.weightDisplay}>
            <TextInput
              style={styles.weightDisplayInput}
              maxLength={3}
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
          <Text style={styles.setTimes}>x</Text>
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
    let plans = this.state.plans;

    let currentPlan = this.state.currentPlan;
    let currentExercise = this.state.currentExercise;
    let currentDay = this.state.currentDay;

    let plan = plans[currentPlan];

    // AsyncStorage.setItem('plans', JSON.stringify(plansData));
    // AsyncStorage.setItem('exercises', JSON.stringify(exerciseData));

    let exercises = plan.days[currentDay].exercises;
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
          transparent={false} >
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
                onPress={() => this.setState({planModalVisible: false, confirmDelete: false, deletePlanText: Config.deletePlanText})} >
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
          transparent={false} >
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
          >
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
          transparent={false} >
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
        <View style={styles.daySection}>
          <View style={[styles.dayView,styles.dayMain]}>
            <TouchableHighlight
              onPress={() => this.handleDayPress()} >
              <Text style={[styles.dayText, {alignItems: 'flex-start'}]}>
                Day
              </Text>
            </TouchableHighlight>
          </View>
          {this.createHeaderDays(plan.days)}
        </View>

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

class VideoLink extends Main {
  constructor (props) {
    super(props);
  }

  handleVideoPress(row) {
    console.log(this.props);
    let exerciseID  = this.state.plans[this.state.currentPlan].days[this.state.currentDay].exercises[row].id;
    let exercise = {};

    this.state.exercises.forEach((eachExercise) => {
      if (eachExercise.id === exerciseID) {
        exercise = eachExercise
      }
    });

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

          onPress={() => this.handleVideoPress(this.props.row)}>
          <Image
            style={styles.videoImage}
            source={require('../Assets/Images/video.png')}
          />
        </TouchableHighlight>
      </View>
    );
  }
}

class NoteLink extends Main {
  constructor (props) {
    super(props);
  }

  handleNotesPress() {
    console.log(this.props);
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

class CheatSheetLink extends Main {
  constructor (props) {
    super(props);
  }

  handleCheatsheetPress() {
    if (Platform.OS == 'ios') {
      this.props.navigator.push({
        title: "Cheatsheet",
        component: Cheatsheet
      });
    } else {
      console.log('handle')
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
        transparent={false} >
        <ScrollView style={[styles.modal, styles.introModal]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}>Welcome to Weight Tracker!</Text>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.modalListItem}>Each workout "plan" contains several days worth of exercises. Each exercise listed for that plan's day has a corresponding video link, last achieved weight (lb and kg), number of sets, and +1 and +5 weight increments.</Text>
            <Text style={styles.modalListItem}>Switch to another day's exercises by tapping the corresponding number.</Text>
            <Text style={styles.modalListItem}>Change, rename, or create new plans by tapping the plan name in the top left corner.</Text>
            <Text style={styles.modalListItem}>Edit, remove, or permanently delete an exercise by tapping the exercise's name in the list.</Text>
            <Text style={styles.modalListItem}>Add/remove, create/delete, or edit exercises by tapping "Add New Exercises" at the bottom of the exercise list. </Text>
            <Text style={styles.modalListItem}>Add, remove, or rename "days" by tapping on the word "Day."</Text>
            <Text style={styles.modalListItem}>Change an exercise's weight by either tapping the weight and typing it in, or by taping the +1 and +5 increment buttons.</Text>
            <Text style={styles.modalListItem}>Swap units by tapping "lb" or "kg."</Text>
            <Text style={styles.modalListItem}>Change number of sets on an exercise by tapping on "x3."</Text>
            <Text>Click the notes button in the top right corner for a page of free-form notes</Text>
            <Text>Click the ? button for a link to the Julian.com cheatsheet</Text>
          </View>
          <View style={styles.modalFooter}>
            <TouchableHighlight
              style={[styles.buttonExit, styles.button]}
              onPress={() => this.setState({introModalVisible: false})}
              >
              <Text style={styles.buttonText}>Start Tracking</Text>
            </TouchableHighlight>
          </View>
        </ScrollView>
      </Modal>
    )
  }
}

class ModalPlan extends Main {
  constructor(props) {
    super(props);
  }
}

class ModalDay extends Main {
  constructor(props) {
    super(props);
  }
}

class ModalExerciseEdit extends Main {
  constructor(props) {
    super(props);
  }
}

class ModalExerciseAdd extends Main {
  constructor(props) {
    super(props);
  }
}

module.exports = Main;
