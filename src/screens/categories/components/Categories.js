// @flow

import * as React from 'react'
import { Button, Text } from 'react-native-elements'
import CategoriesMapModel from '../../../modules/endpoint/models/CategoriesMapModel'
import type { NavigationScreenProp } from 'react-navigation'

class Categories extends React.Component<{ categories: CategoriesMapModel, navigation: NavigationScreenProp<*> }> {
  static navigationOptions = {
    headerTitle: 'Categories'
  }

  nav = () => this.props.navigation.navigate('Dashboard')

  render () {
    return (<React.Fragment>
        <Text>This is the Categoriess</Text>
        <Button
          title='Go to Dashboard'
          onPress={this.nav}
        />
      </React.Fragment>
    )
  }
}

export default Categories
