import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { InnerChatMessage } from './ChatMessage'

const dotPattern = ['...', '·..', '.·.', '..·']
const TYPING_INTERVAL = 400

type TypingIndicatorProps = {
  isVisible: boolean
}

const TypingIndicator = ({ isVisible }: TypingIndicatorProps): ReactElement | null => {
  const { t } = useTranslation('chat')
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => setIndex(prev => (prev + 1) % dotPattern.length), TYPING_INTERVAL)
      return () => clearInterval(interval)
    }
    setIndex(0)
    return undefined
  }, [isVisible])

  return isVisible ? (
    <InnerChatMessage
      userIsAuthor={false}
      showAvatar={false}
      isAutomaticAnswer
      content={`${t('generateAnswer')} ${dotPattern[index]}`}
    />
  ) : null
}

export default TypingIndicator
