import { useNetInfo } from '@react-native-community/netinfo'
import { useRef } from 'react'

import appSettings from '../utils/AppSettings'
import { sendRequest } from '../utils/sendTrackingSignal'
import { reportError } from '../utils/sentry'

const useSendOfflineJpalSignals = (): void => {
  const { isInternetReachable } = useNetInfo()
  const previousIsInternetReachable = useRef<boolean>(false)

  const sendOfflineSignals = async () => {
    const signals = await appSettings.clearJpalSignals()
    await Promise.all(signals.map(signal => sendRequest(signal)))
  }

  if (previousIsInternetReachable.current !== isInternetReachable) {
    previousIsInternetReachable.current = !!isInternetReachable

    if (isInternetReachable) {
      sendOfflineSignals().catch(reportError)
    }
  }
}

export default useSendOfflineJpalSignals
