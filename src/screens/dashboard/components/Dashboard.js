import * as React from 'react'
import { Button, Text } from 'react-native-elements'
import Caption from '../../../modules/common/components/Caption'

class Dashboard extends React.Component<{}> {
  static navigationOptions = {
    headerTitle: 'Dashboard'
  }

  nav = () => this.props.navigation.navigate('Categories')

  render () {
    return (<React.Fragment>
        <Text>This is the Dashboard</Text>
        <Caption title={'Captionfgv'} />
        <Button
          title='Go to Categories'
          onPress={this.nav}
        />
      </React.Fragment>
    )
  }
}

export default Dashboard
