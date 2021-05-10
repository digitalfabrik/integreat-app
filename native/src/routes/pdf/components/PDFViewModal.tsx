import Pdf from 'react-native-pdf'
import * as React from 'react'
import { View } from 'react-native'
import FailureContainer from '../../../modules/error/containers/FailureContainer'
import { ThemeType } from 'build-configs/ThemeType'
import withTheme from '../../../modules/theme/hocs/withTheme'
import { NavigationPropType, RoutePropType } from '../../../modules/app/constants/NavigationTypes'
import { PdfViewModalRouteType } from 'api-client/src/routes'
import { ErrorCode } from '../../../modules/error/ErrorCodes'

type PropsType = {
  route: RoutePropType<PdfViewModalRouteType>
  navigation: NavigationPropType<PdfViewModalRouteType>
  theme: ThemeType
}
type StateType = {
  error: boolean
}

class PDFViewModal extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props)
    this.state = {
      error: false
    }
  }

  onError = () =>
    this.setState(() => ({
      error: true
    }))

  render() {
    const { theme, route } = this.props
    const url = route.params.url
    const { error } = this.state

    if (error) {
      return <FailureContainer code={ErrorCode.UnknownError} />
    }

    return (
      <View
        style={{
          flex: 1
        }}>
        <Pdf
          singlePage={false}
          style={{
            flex: 1,
            backgroundColor: theme.colors.backgroundAccentColor
          }}
          activityIndicatorProps={{
            color: theme.colors.themeColor,
            progressTintColor: theme.colors.themeColor
          }}
          source={{
            uri: url
          }}
          onError={this.onError}
        />
      </View>
    )
  }
}

export default withTheme<PropsType>(PDFViewModal)
