import PDFView from 'react-native-view-pdf'
import * as React from 'react'
import { View } from 'react-native'

export default class PDF extends React.Component {
  render () {
    const resourceType = 'base64'

    return (
      <View style={{flex: 1}}>
        {/* Some Controls to change PDF resource */}
        <PDFView
          fadeInDuration={250.0}
          style={{flex: 1}}
          resource={this.props.navigation.getParam('file')}
          resourceType={'url'}
          onLoad={() => console.log(`PDF rendered from ${resourceType}`)}
          onError={() => console.log('Cannot render PDF', error)}
        />
      </View>
    )
  }
}
