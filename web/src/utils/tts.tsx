import EasySpeech from 'easy-speech'

const initializedStatus = ['init: failed', 'created']

export const ttsInitialized = (): boolean =>
  !initializedStatus.some(status => EasySpeech.status().status.includes(status))

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
  const voices = EasySpeech.voices().filter(voice => voice.lang.startsWith(languageCode))
  return voices.find(voice => voice.name.includes(defaultVoices[languageCode] ?? '')) ?? voices[0] ?? null
}
