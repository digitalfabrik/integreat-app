// @flow

import Pdf from 'react-native-pdf'
import * as React from 'react'
import { View } from 'react-native'
import type { NavigationStackProp } from 'react-navigation-stack'
import FailureContainer from '../../../modules/error/containers/FailureContainer'
import type { ThemeType } from '../../../modules/theme/constants'
import withTheme from '../../../modules/theme/hocs/withTheme'
import withRouteCleaner from '../../../modules/endpoint/hocs/withRouteCleaner'

type PropsType = {
  navigation: NavigationStackProp<*>,
  url: string,
  theme: ThemeType
}

type StateType = {
  error: ?Error
}

class PDFViewModal extends React.Component<PropsType, StateType> {
  constructor (props: PropsType) {
    super(props)
    this.state = { error: null }
  }

  onError = (error: Error) => this.setState(() => ({ error }))

  render () {
    const { theme, navigation } = this.props
    const url = navigation.getParam('url')
    const { error } = this.state
    if (error) {
      return <FailureContainer code='unknownError' />
    }

    return (
      <View style={{ flex: 1 }}>
        <Pdf
          singlePage={false}
          style={{ flex: 1 }}
          activityIndicatorProps={{
            color: theme.colors.themeColor,
            progressTintColor: theme.colors.themeColor
          }}
          source={{ uri: url }}
          onError={this.onError}
        />
      </View>
    )
  }
}

export default withRouteCleaner(
  withTheme<PropsType>(PDFViewModal)
)
