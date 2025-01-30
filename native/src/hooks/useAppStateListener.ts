import { useEffect } from 'react'
import { AppState, AppStateStatus } from 'react-native'

const useAppStateListener = (onChange: (appState: AppStateStatus) => void): void =>
  useEffect(() => {
    const subscription = AppState.addEventListener('change', onChange)
    return subscription.remove
  }, [onChange])

export default useAppStateListener
