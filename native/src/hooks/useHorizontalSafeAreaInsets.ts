import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { isRTL } from '../constants/contentDirection'

const useHorizontalSafeAreaInsets = (): { start: number; end: number } => {
  const { left, right } = useSafeAreaInsets()
  return isRTL() ? { start: right, end: left } : { start: left, end: right }
}

export default useHorizontalSafeAreaInsets
