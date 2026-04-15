import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { InnerChatMessage } from './ChatMessage'

const Dot = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.text.disabled,
  opacity: 0.3,
  animation: 'dotPulse 1.2s infinite',
}))

const DotsWrapper = styled('span')(() => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 2,
  '@keyframes dotPulse': {
    '0%': { opacity: 0.3, transform: 'scale(0.8)' },
    '20%': { opacity: 1, transform: 'scale(1)' },
    '100%': { opacity: 0.3, transform: 'scale(0.8)' },
  },
  '& > span:nth-of-type(1)': { animationDelay: '0s' },
  '& > span:nth-of-type(2)': { animationDelay: '0.2s' },
  '& > span:nth-of-type(3)': { animationDelay: '0.4s' },
}))

type TypingIndicatorProps = {
  isVisible: boolean
}

const TypingIndicator = ({ isVisible }: TypingIndicatorProps): ReactElement | null => {
  const { t } = useTranslation('chat')
  return (
    <div role='status'>
      {isVisible ? (
        <InnerChatMessage
          userIsAuthor={false}
          showAvatar
          isAutomaticAnswer
          content={
            <DotsWrapper aria-label={t('generateAnswer')}>
              <Dot />
              <Dot />
              <Dot />
            </DotsWrapper>
          }
        />
      ) : null}
    </div>
  )
}

export default TypingIndicator
