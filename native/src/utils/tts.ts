import { Platform } from 'react-native'

// Strips 'Uhr' from strings like '8:22 Uhr' and '11:30Uhr' since it is automatically added by tts on android
export const prepareText = (text: string): string =>
  Platform.OS === 'android'
    ? text.replace(/(\d{1,2}:\d{2})\s?Uhr(\W|$)/g, (_, time, suffix) => `${time}${suffix}`)
    : text
