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

import styles from '../Helpers/Styles.js';

import Plan from './Plan';
import Cheatsheet from './Cheatsheet';
import Video from './Video';

Config = {
  deletePlanText: "Delete Plan",
  deleteExerciseText: "Delete Exercise",
  deleteDayText: "Delete Day",
  confirmDeleteText: "Are you sure?"
}

class Main extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      // indices of current items, not their IDs
      currentPlan: 0,
      currentDay: 0,
      currentExercise: 0,

      plans: plansData,
      exercises: exerciseData,

      planModalVisible: false,
      editExerciseModalVisible: false,
      addExerciseModalVisible: false,
      addExerciseModalMessage: '',
      dayModalVisible: false,
      dayModalMessage: '',

      confirmDelete: false,
      deletePlanText: Config.deletePlanText,
      deleteExerciseText: Config.deleteExerciseText,
      deleteDayText: Config.deleteDayText,
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
    let name = '';

    this.state.exercises.forEach((exercise) => {
      if (exercise.id == id) {
        name = exercise.name;
      }
    })

    return name;
  }
  // resetExerciseModal() {
  //   this.setState({
  //     confirmDelete: false,
  //     deleteExerciseText: Config.deleteExerciseText,
  //     currentExercise: 0,
  //   });
  // }

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
    let exercise = {};

    this.state.exercises.forEach((eachExercise) => {
      if (eachExercise.id === exerciseID) {
        exercise = eachExercise
      }
    });

    let uri = exercise.video;
    let title = exercise.name + " video"

    this.props.navigator.push({
      title: title,
      component: Video,
      passProps: {
        exercise: exercise,
        uri: uri
      }
    });
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
    // current plan is the new plan's index
    newState.currentPlan = plansLength;
    newState.confirmDelete = false;
    newState.deletePlanText = Config.deletePlanText;

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

      newState.plans.splice(newState.currentPlan, 1)

      newState.currentPlan = newState.plans.length - 1;
      newState.confirmDelete = false;
      newState.deletePlanText = Config.deletePlanText;

      this.setState(newState);
      AsyncStorage.setItem('plans', JSON.stringify(newState.plans));
    }

  }

  handleDayNew() {
    let newState = this.state;

    let plan = newState.plans[newState.currentPlan];
    let daysLength = plan.days.length;

    if (daysLength >= 5) {
      this.setState({
        dayModalMessage: "The maximum days per plan are 5."
      });
    } else {
      let dayID = plan.days[daysLength-1].id + 1;

      let newDay = {
        id: dayID,
        exercises: []
      }

      newState.plans[newState.currentPlan].days.push(newDay);
      newState.currentDay = daysLength;
      newState.dayModalMessage = '';

      this.setState(newState);
      AsyncStorage.setItem('plans', JSON.stringify(newState.plans));
    }

  }
  handleDayDelete(id) {
    let newState = this.state;

    let plan = newState.plans[newState.currentPlan];
    let daysLength = plan.days.length;

    if (daysLength <= 2) {
      this.setState({
        dayModalMessage: "The minimum days per plan are 2."
      })
    } else {
      plan.days.forEach((day, index) => {
        if (day.id == id) {
          newState.plans[newState.currentPlan].days.splice(index, 1);
        }
      });

      newState.currentDay = 0;
      newState.dayModalMessage = '';

      this.setState(newState);
      AsyncStorage.setItem('plans', JSON.stringify(newState.plans));
    }
  }
  handleDayChange(day) {
    let newState = this.state;
    newState.currentDay = day;

    this.setState(newState)
  }
  handleDayMove() {

  }

  handleExerciseChange(id) {
    console.log(id);
    this.setState({
      currentExercise: id
    });

    console.log(this.state.exercises[id]);
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

  handleExerciseMove() {
    
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
          newState.exercises.splice(index, 1);
        }
      });

      // remove exercise from all plans
      newState.plans.forEach((plan, planIndex) => {
        plan.days.forEach((day, dayIndex) => {
          day.exercises.forEach((exercise, exerciseIndex) => {
            if (exercise.id === id) {
              name = exercise.name;
              newState.plans[planIndex].days[dayIndex].exercises.splice(exerciseIndex, 1);
            }
          });
        });
      });

      newState.confirmDelete = false;
      newState.deleteExerciseText = Config.deleteExerciseText;
      newState.currentExercise = 0;
      newState.addExerciseModalMessage = `#{name} deleted.`;

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
    newState.addExerciseModalMessage = "New exercise created!"

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
        addExerciseModalMessage: `${this.getExerciseName(id)} is already added to this plan's day. Choose another exercise.`,
      });
    } else {
      let exerciseLength = newState.plans[newState.currentPlan].days[newState.currentDay].exercises.length;

      let newExercise = {
        id: id,
        weight: 50,
        sets: 3,
        unit: "lb"
      }

      newState.plans[newState.currentPlan].days[newState.currentDay].exercises.push(newExercise);
      newState.addExerciseModalMessage = `${this.getExerciseName(id)} added to plan.`
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
  handleWeightIncrement(id, heavy) {
    let newState = this.state;
    let exercise = newState.plans[this.state.currentPlan].days[newState.currentDay].exercises[id];
    let newWeight = exercise.weight;
    let increment = heavy ? 5 : 1;

    newState.plans[newState.currentPlan].days[newState.currentDay].exercises[id].weight = parseFloat((newWeight + increment).toFixed(2));

    this.setState(newState);
    AsyncStorage.setItem('plans', JSON.stringify(newState.plans));
  }

  render() {
    let plans = this.state.plans;

    let currentPlan = this.state.currentPlan;
    let currentExercise = this.state.currentExercise;
    let currentDay = this.state.currentDay;

    let plan = plans[currentPlan];

    let exercises = plan.days[currentDay].exercises;
    let exercisesAll = this.state.exercises;

    let ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
    let dataSource =  ds.cloneWithRows(exercises);

    let headerDays = plan.days.map((day, index) => {
        let dayTextStyles = [styles.dayText, styles.dayButton];

        if (day.id === this.state.currentDay) {
          dayTextStyles.push(styles.currentDay);
        }
        return (
          <TouchableHighlight
            key={day.id}
            onPress={() => this.handleDayChange(day.id)}
            style={styles.dayView}
          >
            <View>
              <Text style={dayTextStyles}>
                {index+1}
              </Text>
            </View>
          </TouchableHighlight>
        );
      });

    let planPickerItems = plans.map((plan, index) =>
      <Picker.Item style={styles.pickerItem} key={index} label={plan.name} value={index} />
    );

    let exercisePickerItems = exercisesAll.map((exercise, index) =>
      <Picker.Item style={styles.pickerItem} key={index} label={exercise.name} value={index} />
    );

    let dayPickerItems = plan.days.map((day, index) =>
      <Picker.Item style={styles.pickerItem} key={index} label={(index+1).toString()} value={index} />
    );

    return (
      <View style={styles.mainContainer}>

        {/*Plan Modal*/}
        <Modal
          animationType={'slide'}
          visible={this.state.planModalVisible}
          transparent={false} >
          <View style={[styles.planModal, styles.modal]}>
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
                {planPickerItems}
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
            <View style={styles.modalFooter}>
              <TouchableHighlight
                style={[styles.buttonExit, styles.button]}
                onPress={() => this.setState({planModalVisible: false, confirmDelete: false, deletePlanText: Config.deletePlanText})} >
                <Text style={styles.buttonText}>Choose Plan</Text>
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
          </View>
        </Modal>
        {/*Add Exercise Modal*/}
        <Modal
          animationType={'slide'}
          visible={this.state.addExerciseModalVisible}
          transparent={false} >
          <View style={[styles.addExerciseModal, styles.modal]}>
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
                {exercisePickerItems}
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
                style={[styles.buttonExit, styles.button]}
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
          </View>
        </Modal>
        {/*Edit Exercise Modal*/}
        <Modal
          animationType={'slide'}
          visible={this.state.editExerciseModalVisible}
          transparent={false}
          >
          <View style={[styles.exerciseModal, styles.modal]}>
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
                onPress={() => this.setState({editExerciseModalVisible: false, currentExercise: 0})} >
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
          </View>
        </Modal>
        {/*Day Modal*/}
        <Modal
          animationType={'slide'}
          visible={this.state.dayModalVisible}
          transparent={false} >
          <View style={[styles.dayModal, styles.modal]}>
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
                {dayPickerItems}
              </Picker>
            </View>

            {/*<View style={styles.form}>
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
            </View>*/}

            <View style={styles.modalFooter}>
              <TouchableHighlight
                style={[styles.buttonExit, styles.button]}
                onPress={() => this.setState({dayModalVisible: false})} >
                <Text style={styles.buttonText}>Back to Plan</Text>
              </TouchableHighlight>
            </View>
            <View style={styles.modalBottom}>
              <TouchableHighlight
                style={[styles.buttonCreate, styles.button]}
                onPress={() => this.handleDayNew()} >
                <Text style={styles.buttonText}>Create New Day</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={[styles.buttonDelete, styles.button]}
                onPress={() => this.handleDayDelete()} >
                <Text style={styles.buttonText}>{this.state.deleteDayText}</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>

        {/*Header Section*/}
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
            <TouchableHighlight
              onPress={() => this.handleDayPress()} >
              <Text style={[styles.dayText]}>
                Day
              </Text>
            </TouchableHighlight>
          </View>
          {headerDays}
        </View>

        {/*Exercise Section*/}
        <View style={styles.exerciseSection}  >
          <ListView
            dataSource={dataSource}
            automaticallyAdjustContentInsets={false}
            renderFooter={() =>
              <View style={styles.exerciseSectionFooter}>
                <TouchableHighlight
                  style={[styles.buttonCreate, styles.button]}
                  onPress={() => this.setState({addExerciseModalVisible: true})} >
                    <Text style={styles.buttonText}>Add New Exercise</Text>
                </TouchableHighlight>
              </View>
            }
            renderRow={(exercise, section, row) =>
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
                  <View>
                    <TouchableHighlight
                      style={styles.videoLink}
                      onPress={(event) => this.handleVideoPress(row, event)}>
                      <Text style={styles.videoText}>Video</Text>
                    </TouchableHighlight>
                  </View>
                </View>
                <View style={styles.exerciseBody}>
                  {/*Weight Display*/}
                  <View style={styles.weightDisplay}>
                    <TextInput
                      style={styles.weightDisplayInput}
                      maxLength={3}
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
                    keyboardType='numeric'
                    value={exercise.sets.toString()}
                    onChange={(event) => this.handleSetChange(row, event)} />
                  {/*Weight Increments*/}
                  <View style={styles.weightIncrements}>
                    <View style={styles.weightIncrementBox}>
                      <TouchableHighlight
                        style={styles.weightIncrement}
                        onPress={(event) => this.handleWeightIncrement(row)} >
                        <Text>+1</Text>
                      </TouchableHighlight>
                    </View>
                    <View style={styles.weightIncrementBox}>
                      <TouchableHighlight
                        style={styles.weightIncrement}
                        onPress={(event) => this.handleWeightIncrement(row, true)} >
                        <Text>+5</Text>
                      </TouchableHighlight>
                    </View>
                  </View>
                  {/*Weight Increments*/}
                </View>
              </View>
            }
          />
          {/*ListView*/}
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


module.exports = Main;
