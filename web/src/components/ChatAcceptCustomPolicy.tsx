import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { CityModel } from 'shared/api'

import Caption from './Caption'
import PrivacyCheckbox from './PrivacyCheckbox'

type ChatAcceptCustomPolicyProps = {
  onAcceptPolicy: () => void
  city: CityModel
  languageCode: string
}

const ChatAcceptCustomPolicy = ({ onAcceptPolicy, city, languageCode }: ChatAcceptCustomPolicyProps): ReactElement => {
  const { t } = useTranslation('chat')
  return (
    <div>
      <Caption title={t('settings:privacyPolicy')} />
      {t('privacyPolicyInformation', { city: city.name })}
      <PrivacyCheckbox
        language={languageCode}
        checked={false}
        setChecked={onAcceptPolicy}
        url={city.chatPrivacyPolicyUrl}
      />
    </div>
  )
}

export default ChatAcceptCustomPolicy
