class GeolocateControl {
  _container: HTMLElement = document.createElement('div')
}

const getRTLTextPluginStatus = (): string => 'unavailable'
const setRTLTextPlugin = (): Promise<void> => Promise.resolve()
const setWorkerUrl = (): void => undefined

export { GeolocateControl, getRTLTextPluginStatus, setRTLTextPlugin, setWorkerUrl }
export default { GeolocateControl, getRTLTextPluginStatus, setRTLTextPlugin, setWorkerUrl }
