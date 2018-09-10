// @flow

import * as React from 'react'
import { Button } from 'react-native-elements'
import type { NavigationScreenProp } from 'react-navigation'
import Caption from '../../../modules/common/components/Caption'

type PropsType = {
  navigation: NavigationScreenProp<*>,
  toggleTheme: () => void
}

class Dashboard extends React.Component<PropsType> {
  static navigationOptions = {
    headerTitle: 'Dashboard'
  }

  categories = () => this.props.navigation.navigate('Categories')

  landing = () => this.props.navigation.navigate('Landing')

  render () {
    return (<React.Fragment>
        <Caption title={this.props.navigation.getParam('city').name} />
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
      </React.Fragment>
    )
  }
}

export default Dashboard
