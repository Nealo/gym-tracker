import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  TextInput,
  ScrollView,
  TouchableHighlight,
  Picker,
} from 'react-native';

import plansData from '../../plans.json';

class Plan extends React.Component{
  constructor(props) {
    super(props)

    this.state = {
      plans: plansData,
      currentPlan: this.props.currentPlan
    }
  }

  handlePlanChange(id) {
    this.setState({
      currentPlan: id
    })
  }
  handlePlanNameChange(e) {
    let newState = this.state;
    newState.plans[newState.currentPlan].name = e.nativeEvent.text;

    this.setState(newState);
  }
  handleNewPlan(e) {
    let newState = this.state;
    let planID  = newState.plans.length;
    let newPlan = {
      "id": planID,
      "name": "New Plan",
      "exercises": []
    }

    newState.plans.push(newPlan);
    newState.currentPlan = planID;

    this.setState(newState);
  }


  render() {
    let plans = this.state.plans;
    let currentPlan = this.state.currentPlan;

    let plan = plans[currentPlan];

    let pickerItems = plans.map((plan) =>
      <Picker.Item key={plan.id} label={plan.name} value={plan.id} />
    );

    return (
      <View style={{marginTop: 80}}>
        <View style={styles.mask}>
          <Picker
            mode="dropdown"
            selectedValue={plans[currentPlan].id}
            onValueChange={(id) => this.handlePlanChange(id)}
            >
            {pickerItems}
          </Picker>
        </View>
        <View>
          <TextInput
            style={{padding: 10, height: 40, borderColor: 'gray', borderWidth: 1}}
            value={plan.name}
            onChange={this.handlePlanNameChange.bind(this)} />
        </View>
        <View>
          <TouchableHighlight
            onPress={(id) => this.handleNewPlan()}
          >
            <Text>Create New Plan</Text>
          </TouchableHighlight>
        </View>
        <View>
        </View>





      </View>
    );
  }
}

var styles = StyleSheet.create({
  mask: {
    flex: 1,
    height: 75,
    overflow: 'hidden',
    justifyContent: 'space-around'
  },
});

module.exports = Plan;
