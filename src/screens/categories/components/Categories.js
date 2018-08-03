import * as React from 'react'
import { Button, Text } from 'react-native-elements'

class Categories extends React.Component<{}> {
  static navigationOptions = {
    headerTitle: 'Categories'
  }

  nav = () => this.props.navigation.navigate('Dashboard')

  render () {
    return (<React.Fragment>
        <Text>This is the Categories</Text>
        <Button
          title='Go to Dashboard'
          onPress={this.nav}
        />
      </React.Fragment>
    )
  }
}

export default Categories
