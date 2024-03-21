import { useNetInfo } from '@react-native-community/netinfo'
import { useRef } from 'react'

import { sendRequest } from '../utils/sendTrackingSignal'
import { reportError } from '../utils/sentry'
import { useAppContext } from './useCityAppContext'

const useSendOfflineJpalSignals = (): void => {
  const { settings, updateSettings } = useAppContext()
  const { isInternetReachable } = useNetInfo()
  const previousIsInternetReachable = useRef<boolean>(false)
  const { jpalSignals } = settings

  const sendOfflineSignals = async () => {
    updateSettings({ jpalSignals: [] })
    await Promise.all(jpalSignals.map(signal => sendRequest(signal)))
  }

  if (previousIsInternetReachable.current !== isInternetReachable) {
    previousIsInternetReachable.current = !!isInternetReachable

    if (isInternetReachable) {
      sendOfflineSignals().catch(reportError)
    }
  }
}

export default useSendOfflineJpalSignals
