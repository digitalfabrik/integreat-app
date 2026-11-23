import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { isRTL } from '../constants/contentDirection'

const useHorizontalSafeAreaInsets = (): { start: number; end: number } => {
  const { left, right } = useSafeAreaInsets()
  // Only pad one-sided insets (iPhone Duo), not equal ones (notched iPhones in landscape)
  if (left === right) {
    return { start: 0, end: 0 }
  }
  return isRTL() ? { start: right, end: left } : { start: left, end: right }
}

export default useHorizontalSafeAreaInsets
