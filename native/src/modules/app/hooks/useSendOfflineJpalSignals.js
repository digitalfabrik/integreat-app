// @flow

import { useRef } from 'react'
import { useNetInfo } from '@react-native-community/netinfo'
import AppSettings from '../../settings/AppSettings'
import { sendCompleteSignal } from '../../endpoint/sendTrackingSignal'

const appSettings = new AppSettings()

const useSendOfflineJpalSignals = () => {
  const { isInternetReachable } = useNetInfo()
  const previousIsInternetReachable = useRef<boolean>(false)

  const sendOfflineSignals = async () => {
    const signals = await appSettings.clearJpalSignals()
    await Promise.all(signals.map(signal => sendCompleteSignal(signal)))
  }

  if (previousIsInternetReachable.current !== isInternetReachable) {
    previousIsInternetReachable.current = isInternetReachable
    if (isInternetReachable) {
      sendOfflineSignals().catch(e => console.error(e))
    }
  }
}

export default useSendOfflineJpalSignals
