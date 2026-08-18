import { useRef, useEffect, useState } from 'react'

const useAnnounceLanguageChange = (
  languageCode: string,
  languageChangePaths: { code: string; name: string }[] | null,
  t: (key: string) => string,
): string => {
  const previousLanguage = useRef(languageCode)
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    if (previousLanguage.current !== languageCode) {
      const languageName = languageChangePaths?.find(l => l.code === languageCode)?.name ?? languageCode
      setAnnouncement(`${t('languageChangedTo')} ${languageName}`)
      previousLanguage.current = languageCode
    }
  }, [languageCode, languageChangePaths, t])

  return announcement
}

export default useAnnounceLanguageChange
