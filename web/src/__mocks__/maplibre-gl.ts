class GeolocateControl {
  _container: HTMLElement = document.createElement('div')
}

const getRTLTextPluginStatus = (): string => 'unavailable'
const setRTLTextPlugin = (): Promise<void> => Promise.resolve()

export { GeolocateControl, getRTLTextPluginStatus, setRTLTextPlugin }
export default { GeolocateControl, getRTLTextPluginStatus, setRTLTextPlugin }
