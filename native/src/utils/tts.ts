import { Platform } from 'react-native'

// Strips 'Uhr' from strings like '12 Uhr' or '11:30Uhr' since it is automatically added by tts on android
export const prepareText = (text: string): string =>
  Platform.OS === 'android' ? text.replace(/(\d+)\s?Uhr(\W|$)/g, (_, time, suffix) => `${time}${suffix}`) : text
