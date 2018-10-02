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

  async download (): Promise<void> {
    const progressListener = (offlinePack, status) => {
      this.setState({percentage: status.percentage / 100})
      console.log(offlinePack, status)
    }

    // await MapboxGL.offlineManager.deletePack('augsburg')
    await MapboxGL.offlineManager.createPack({
      name: 'augsburg',
      styleURL: 'http://max-arch:8080/style.json',
      minZoom: 14,
      maxZoom: 20,
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
            styleURL={'http://max-arch:8080/style.json'}
            style={{
              width: '100%',
              height: '100%'
            }}
            zoomLevel={10}
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
