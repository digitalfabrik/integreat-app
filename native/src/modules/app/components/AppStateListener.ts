import { useEffect } from 'react'
import { AppState } from 'react-native'
import sendTrackingSignal from '../../endpoint/sendTrackingSignal'
import { RESUME_SIGNAL_NAME, SUSPEND_SIGNAL_NAME } from 'api-client'

const AppStateListener = () => {
  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange)
    return () => {
      AppState.removeEventListener('change', handleAppStateChange)
    }
  }, [])

  const handleAppStateChange = (nextAppState: string) => {
    if (nextAppState === 'active') {
      sendTrackingSignal({
        signal: {
          name: RESUME_SIGNAL_NAME
        }
      })
    } else if (nextAppState === 'background') {
      sendTrackingSignal({
        signal: {
          name: SUSPEND_SIGNAL_NAME
        }
      })
    }
  }

  return null
}

export default AppStateListener
