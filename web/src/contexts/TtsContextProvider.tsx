import React, { createContext, ReactElement, useMemo, useState } from 'react'

export type TtsContextType = {
  content: string
  setContent: React.Dispatch<React.SetStateAction<string>>
  visible: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  title: string
  setTitle: React.Dispatch<React.SetStateAction<string>>
  volume: number
  setVolume: React.Dispatch<React.SetStateAction<number>>
}
export const ttsContext = createContext<TtsContextType>({
  content: '',
  setContent: () => undefined,
  visible: false,
  setVisible: () => undefined,
  title: '',
  setTitle: () => undefined,
  volume: 50,
  setVolume: () => undefined,
})
type TtsContextProviderProps = {
  children: ReactElement
  initialVisibility?: boolean
}
const TtsContextProvider = ({ children, initialVisibility = false }: TtsContextProviderProps): ReactElement => {
  const defaultVolume = 0.5
  const [volume, setVolume] = useState(defaultVolume)
  const [visible, setVisible] = useState(initialVisibility)
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const ttsContextValue = useMemo(
    () => ({
      content,
      setContent,
      visible,
      setVisible,
      title,
      setTitle,
      volume,
      setVolume,
    }),
    [content, visible, title, volume],
  )
  return <ttsContext.Provider value={ttsContextValue}>{children}</ttsContext.Provider>
}
export default TtsContextProvider
