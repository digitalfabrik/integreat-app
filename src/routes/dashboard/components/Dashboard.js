// @flow

import * as React from 'react'
import { Button } from 'react-native-elements'
import type { NavigationScreenProp } from 'react-navigation'
import Caption from '../../../modules/common/components/Caption'
import CityModel from '../../../modules/endpoint/models/CityModel'

type PropsType = {
  navigation: NavigationScreenProp<*>,
  toggleTheme: () => void,
  goOffline: () => void,
  goOnline: () => void
}

class Dashboard extends React.Component<PropsType> {
  static navigationOptions = {
    headerTitle: 'Dashboard'
  }

  categories = () => this.props.navigation.navigate('Categories', {city: this.getCityParam().code})

  landing = () => this.props.navigation.navigate('Landing')

  getCityParam (): CityModel {
    return this.props.navigation.getParam('cityModel')
  }

  render () {
    return (<React.Fragment>
        <Caption title={this.getCityParam().name} />
        <Button
          title='Go to Categories'
          onPress={this.categories}
        />
        <Button
          title='Go to Landing'
          onPress={this.landing}
        />
        <Button
          title='Toggle theme'
          onPress={this.props.toggleTheme}
        />
        <Button
          title='Go Offline'
          onPress={this.props.goOffline}
        />

        <Button
          title='Go Online'
          onPress={this.props.goOnline}
        />
      </React.Fragment>
    )
  }
}

export default Dashboard
