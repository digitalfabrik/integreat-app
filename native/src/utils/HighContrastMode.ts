import { NativeModules } from 'react-native'

export const isHighContrastModeEnabled = async (): Promise<boolean> => {
  const { HighContrastModule } = NativeModules

  return HighContrastModule.isHighContrastMode()
}
