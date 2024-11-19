import React, { createContext, ReactElement, useMemo, useState } from 'react'

export type TtsContextType = {
  visible: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  title: string
  setTitle: React.Dispatch<React.SetStateAction<string>>
  sentences: string[]
  setSentences: React.Dispatch<React.SetStateAction<string[]>>
}
export const ttsContext = createContext<TtsContextType>({
  visible: false,
  setVisible: () => undefined,
  title: '',
  setTitle: () => undefined,
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
  const [title, setTitle] = useState('')
  const ttsContextValue = useMemo(
    () => ({
      visible,
      setVisible,
      title,
      setTitle,
      sentences,
      setSentences,
    }),
    [visible, title, sentences],
  )
  return <ttsContext.Provider value={ttsContextValue}>{children}</ttsContext.Provider>
}
export default TtsContextProvider
