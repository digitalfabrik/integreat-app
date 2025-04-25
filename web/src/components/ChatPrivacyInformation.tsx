import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { MailLockIcon } from '../assets'
import buildConfig from '../constants/buildConfig'
import Icon from './base/Icon'
import Link from './base/Link'

const PrivacyInformationContainer = styled.div`
  position: relative;
  display: flex;
`
const SecurityIconContainer = styled.button`
  width: 32px;
  height: 32px;
  align-self: center;
  margin-inline-start: 8px;
  cursor: pointer;
  display: flex;
  border: none;
  background-color: ${props => props.theme.colors.themeColor};
  border-radius: 0.25em;
`

const SecurityIcon = styled(Icon)`
  width: 100%;
  height: 100%;
  color: ${props => props.theme.colors.textSecondaryColor};
`

type ChatPrivacyInformationProps = {
  cityCustomChatPrivacyPolicy: string | null
}

const ChatPrivacyInformation = ({ cityCustomChatPrivacyPolicy }: ChatPrivacyInformationProps): ReactElement => {
  const { privacyUrls } = buildConfig()
  const privacyUrl = cityCustomChatPrivacyPolicy || privacyUrls.default
  const { t } = useTranslation('chat')
  const [securityInformationVisible, setSecurityInformationVisible] = useState<boolean>(false)
  return (
    <PrivacyInformationContainer>
      <SecurityIconContainer onClick={() => setSecurityInformationVisible(!securityInformationVisible)}>
        <Link to={privacyUrl}>
          <SecurityIcon src={MailLockIcon} />
        </Link>
      </SecurityIconContainer>
    </PrivacyInformationContainer>
  )
}

export default ChatPrivacyInformation
