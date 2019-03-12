/* eslint-disable no-magic-numbers */
// @flow

import * as React from 'react'
import type { NavigationScreenProp } from 'react-navigation'
import MapboxGL from '@mapbox/react-native-mapbox-gl'
import ProgressBar from 'react-native-progress/Bar'
import { View } from 'react-native'

type PropsType = {
  navigation: NavigationScreenProp<*>
}

type StateType = {
  percentage: number
}

MapboxGL.setAccessToken('pk.')
MapboxGL.setTelemetryEnabled(false)

class MapViewModal extends React.Component<PropsType, StateType> {
  constructor (props: PropsType) {
    super(props)
    this.state = {percentage: 0}
  }

  async download () {
    const progressListener = (offlinePack, status) => {
      this.setState({percentage: status.percentage / 100})
    }

    // await MapboxGL.offlineManager.deletePack('augsburg')
    await MapboxGL.offlineManager.createPack({
      name: 'augsburg',
      styleURL: 'http://web.integreat-app.de:7778/style.json',
      minZoom: 13,
      maxZoom: 15,
      bounds: [[10.749338, 48.280761], [10.962173, 48.469737]]
    }, progressListener)
  }

  componentDidMount () {
    this.download()
  }

  render () {
    return (<React.Fragment>
        <ProgressBar progress={this.state.percentage} width={300} />
        <View style={{
          flex: 1
        }}>
           {/* Use SwiftShader in emulator settings to render this */}
          <MapboxGL.MapView
            centerCoordinate={[10.898158, 48.368972]}
            logoEnabled={false}
            styleURL={'http://web.integreat-app.de:7778/style.json'}
            style={{
              width: '100%',
              height: '100%'
            }}
            zoomLevel={13}
            minZoomLevel={13}
            maxZoomLevel={15}
            rotateEnabled={false}
            attributionEnabled={false}
            surfaceView
          >
            <MapboxGL.PointAnnotation
              key={'perlach'}
              id={'perlach'}
              title='Perlach Turm'
              selected
              coordinate={[10.898364, 48.369167]}>
              <MapboxGL.Callout title={'Perlach Turm'} />
            </MapboxGL.PointAnnotation>
          </MapboxGL.MapView>
        </View>
      </React.Fragment>

    )
  }
}

export default MapViewModal
