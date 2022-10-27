import { useEffect, useState } from 'react'

type UseOnLanguageChangeProps = {
  languageCode: string
  onLanguageChange: (newLanguageCode: string, previousLanguageCode: string) => void
}

const useOnLanguageChange = ({ languageCode, onLanguageChange }: UseOnLanguageChangeProps): void => {
  const [previousLanguageCode, setPreviousLanguageCode] = useState<string>(languageCode)

  useEffect(() => {
    if (previousLanguageCode !== languageCode) {
      onLanguageChange(languageCode, previousLanguageCode)
      setPreviousLanguageCode(languageCode)
    }
  }, [previousLanguageCode, languageCode, onLanguageChange])
}

export default useOnLanguageChange
