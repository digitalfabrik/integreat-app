// @flow

import * as React from 'react'
import { Switch } from 'react-native'

type PropType = {
  onValueChange: boolean => void,
  getCurrentValue: () => boolean
}

type StateType = {
  value: boolean
}

export default class SwitchSetting extends React.Component<PropType, StateType> {
  constructor (props: PropType) {
    super(props)

    this.state = {value: props.getCurrentValue()}
  }

  changeValue (value: boolean) {
    this.setState({value})
    this.props.onValueChange(value)
  }

  render () {
    return <Switch onValueChange={this.changeValue} value={this.state.value} />
  }
}
