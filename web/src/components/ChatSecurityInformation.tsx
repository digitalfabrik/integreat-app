import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { CityModel } from 'shared/api'

import { MailLockIcon } from '../assets'
import buildConfig from '../constants/buildConfig'
import Icon from './base/Icon'
import Link from './base/Link'

const SecurityInformationContainer = styled.div`
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

type ChatSecurityInformationProps = {
  city: CityModel
}

const ChatSecurityInformation = ({ city }: ChatSecurityInformationProps): ReactElement => {
  const { privacyUrls } = buildConfig()
  const privacyUrl = city.customChatPrivacyPolicy || privacyUrls.default
  const { t } = useTranslation('chat')
  const [securityInformationVisible, setSecurityInformationVisible] = useState<boolean>(false)
  return (
    <SecurityInformationContainer>
      <SecurityIconContainer onClick={() => setSecurityInformationVisible(!securityInformationVisible)}>
        <Link to={privacyUrl}>
          <SecurityIcon src={MailLockIcon} />
        </Link>
      </SecurityIconContainer>
    </SecurityInformationContainer>
  )
}

export default ChatSecurityInformation
