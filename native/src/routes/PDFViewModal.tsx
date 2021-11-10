import * as React from 'react'
import { View } from 'react-native'
import Pdf from 'react-native-pdf'

import { ErrorCode, PdfViewModalRouteType } from 'api-client'
import { ThemeType } from 'build-configs'

import Failure from '../components/Failure'
import LoadingSpinner from '../components/LoadingSpinner'
import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import withTheme from '../hocs/withTheme'

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
    const { url } = route.params
    const { error } = this.state

    if (error) {
      return <Failure code={ErrorCode.UnknownError} />
    }

    return (
      <View
        style={{
          flex: 1
        }}
      >
        <Pdf
          singlePage={false}
          style={{
            flex: 1,
            backgroundColor: theme.colors.backgroundAccentColor
          }}
          renderActivityIndicator={() => <LoadingSpinner />}
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
