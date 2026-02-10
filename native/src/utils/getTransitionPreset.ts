import { TransitionPreset, TransitionPresets } from '@react-navigation/stack'
import { Platform } from 'react-native'

// Keeps our previous transition we used in v4 of react-navigation on android. Fixes weird showing of splash screen on every navigate.
const getTransitionPreset = (): TransitionPreset | undefined =>
  Platform.select({
    android: TransitionPresets.FadeFromBottomAndroid,
    ios: TransitionPresets.DefaultTransition,
  })

export default getTransitionPreset
