import React, { createContext, ReactElement, useMemo, useState } from 'react'

export type TtsContextType = {
  visible: boolean
  setVisible: (visible: boolean) => void
  sentences: string[]
  setSentences: (sentences: string[]) => void
}
export const ttsContext = createContext<TtsContextType>({
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
  const ttsContextValue = useMemo(
    () => ({
      visible,
      setVisible,
      sentences,
      setSentences,
    }),
    [visible, sentences],
  )
  return <ttsContext.Provider value={ttsContextValue}>{children}</ttsContext.Provider>
}
export default TtsContextProvider
