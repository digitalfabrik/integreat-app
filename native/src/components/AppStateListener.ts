import { RESUME_SIGNAL_NAME, SUSPEND_SIGNAL_NAME } from 'shared'

import useAppStateListener from '../hooks/useAppStateListener'
import sendTrackingSignal from '../utils/sendTrackingSignal'

const AppStateListener = (): null => {
  const handleAppStateChange = (nextAppState: string) => {
    if (nextAppState === 'active') {
      sendTrackingSignal({
        signal: {
          name: RESUME_SIGNAL_NAME,
        },
      })
    } else if (nextAppState === 'background') {
      sendTrackingSignal({
        signal: {
          name: SUSPEND_SIGNAL_NAME,
        },
      })
    }
  }

  useAppStateListener(handleAppStateChange)

  return null
}

export default AppStateListener
