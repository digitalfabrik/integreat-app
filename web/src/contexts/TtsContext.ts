import { createContext } from 'react'

export type TtsContextType = {
  canRead: boolean
  visible: boolean
  showTtsPlayer: () => void
  sentences: string[]
  setSentences: (sentences: string[]) => void
}

export const TtsContext = createContext<TtsContextType>({
  canRead: false,
  visible: false,
  showTtsPlayer: () => undefined,
  sentences: [],
  setSentences: () => undefined,
})
