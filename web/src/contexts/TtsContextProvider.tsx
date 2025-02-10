import React, { createContext, ReactElement, useMemo, useState } from 'react'

import buildConfig from '../constants/buildConfig'

export type TtsContextType = {
  enabled?: boolean
  canRead: boolean
  visible: boolean
  setVisible: (visible: boolean) => void
  sentences: string[]
  setSentences: (sentences: string[]) => void
}

export const TtsContext = createContext<TtsContextType>({
  enabled: false,
  canRead: false,
  visible: false,
  setVisible: () => undefined,
  sentences: [],
  setSentences: () => undefined,
})

type TtsContextProviderProps = {
  children: ReactElement
  initialVisibility?: boolean
}

const TtsContextProvider = ({ children, initialVisibility = false }: TtsContextProviderProps): ReactElement => {
  const [visible, setVisible] = useState(initialVisibility)
  const [sentences, setSentences] = useState<string[]>([])

  const enabled = buildConfig().featureFlags.tts
  const canRead = enabled && sentences.length > 1 // to check if content is available

  const ttsContextValue = useMemo(
    () => ({
      enabled,
      canRead,
      visible,
      setVisible,
      sentences,
      setSentences,
    }),
    [enabled, canRead, visible, sentences],
  )
  return <TtsContext.Provider value={ttsContextValue}>{children}</TtsContext.Provider>
}
export default TtsContextProvider
