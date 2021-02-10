// @flow

import Pdf from 'react-native-pdf'
import * as React from 'react'
import { View } from 'react-native'
import FailureContainer from '../../../modules/error/containers/FailureContainer'
import type { ThemeType } from 'build-configs/ThemeType'
import withTheme from '../../../modules/theme/hocs/withTheme'
import type {
  NavigationPropType,
  RoutePropType
} from '../../../modules/app/constants/NavigationTypes'
import type { PdfViewModalRouteType } from 'api-client/src/routes'

type PropsType = {|
  route: RoutePropType<PdfViewModalRouteType>,
  navigation: NavigationPropType<PdfViewModalRouteType>,
  theme: ThemeType
|}

type StateType = {|
  error: ?Error
|}

class PDFViewModal extends React.Component<PropsType, StateType> {
  constructor (props: PropsType) {
    super(props)
    this.state = { error: null }
  }

  onError = (error: Error) => this.setState(() => ({ error }))

  render () {
    const { theme, route } = this.props
    const url = route.params.url
    const { error } = this.state
    if (error) {
      return <FailureContainer code='unknownError' />
    }

    return (
      <View style={{ flex: 1 }}>
        <Pdf
          singlePage={false}
          style={{ flex: 1, backgroundColor: theme.colors.backgroundAccentColor }}
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

export default withTheme<PropsType>(PDFViewModal)
