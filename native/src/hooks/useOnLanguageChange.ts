import { useEffect, useState } from 'react'

type UseOnLanguageChangeProps = {
  languageCode: string
  onLanguageChange?: (newLanguageCode: string, previousLanguageCode: string) => void
}

const useOnLanguageChange = ({ languageCode, onLanguageChange }: UseOnLanguageChangeProps): string => {
  const [previousLanguageCode, setPreviousLanguageCode] = useState<string>(languageCode)

  useEffect(() => {
    if (previousLanguageCode !== languageCode) {
      if (onLanguageChange) {
        onLanguageChange(languageCode, previousLanguageCode)
      }
      setPreviousLanguageCode(languageCode)
    }
  }, [previousLanguageCode, languageCode, onLanguageChange])

  return previousLanguageCode
}

export default useOnLanguageChange
