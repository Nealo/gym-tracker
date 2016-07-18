import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
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

  render() {
    let plans = this.state.plans;
    let currentPlan = this.state.currentPlan;

    let pickerItems = plans.map((plan) =>
      <Picker.Item key={plan.id} label={plan.name} value={plan.id} />
    );

    return (
      <View style={{marginTop: 0}}>
        <Picker
          selectedValue={plans[currentPlan].id}
          onValueChange={(id) => this.handlePlanChange(id)}
          >
          {pickerItems}
        </Picker>
      </View>
    );
  }
}

var styles = StyleSheet.create({

});

module.exports = Plan;
