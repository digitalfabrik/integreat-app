import EasySpeech from 'easy-speech'

const initializedStatus = ['init: failed', 'created']

export const ttsInitialized = (): boolean =>
  !initializedStatus.some(status => EasySpeech.status().status.includes(status))

const cancelErrorMessages = ['interrupted', 'canceled']

export const isTtsCancelError = (error: unknown): boolean =>
  error instanceof SpeechSynthesisErrorEvent && cancelErrorMessages.includes(error.error)
