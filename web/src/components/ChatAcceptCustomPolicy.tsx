import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Link from './base/Link'

type ChatAcceptCustomPolicyProps = {
  onAcceptPolicy: () => void
  customPrivacyPolicy: string | null
  cityName: string
}

const ChatAcceptCustomPolicy = ({
  onAcceptPolicy,
  customPrivacyPolicy,
  cityName,
}: ChatAcceptCustomPolicyProps): ReactElement => {
  const { t } = useTranslation('common')
  return (
    <div>
      <h2>Privacy Policy</h2>
      <div>
        The chat content will be sent to {cityName}. Please accept their{' '}
        <Link to={customPrivacyPolicy}>Privacy Policy</Link> to use the chat.
      </div>
      <div>
        <button onClick={onAcceptPolicy} type='button'>
          Accept
        </button>
      </div>
    </div>
  )
}

export default ChatAcceptCustomPolicy
