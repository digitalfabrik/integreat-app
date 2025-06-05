import EasySpeech from 'easy-speech'

import { getGenericLanguageCode } from 'shared'

const uninitializedStatus = ['init: failed', 'created']

export const ttsInitialized = (): boolean =>
  !uninitializedStatus.some(status => EasySpeech.status().status.includes(status))

const cancelErrorMessages = ['interrupted', 'canceled']

export const isTtsCancelError = (error: unknown): boolean =>
  error instanceof SpeechSynthesisErrorEvent && cancelErrorMessages.includes(error.error)

const defaultVoices: { [key: string]: string } = {
  de: 'Anna',
  en: 'Daniel',
}

export const getTtsVoice = (languageCode: string): SpeechSynthesisVoice | null => {
  if (!ttsInitialized()) {
    return null
  }
  const genericLanguageCode = getGenericLanguageCode(languageCode)
  const voices = EasySpeech.voices().filter(voice => voice.lang.startsWith(genericLanguageCode))
  return voices.find(voice => voice.name.includes(defaultVoices[genericLanguageCode] ?? '')) ?? voices[0] ?? null
}
