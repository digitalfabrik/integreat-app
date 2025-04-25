import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { MailLockIcon } from '../assets'
import buildConfig from '../constants/buildConfig'
import dimensions from '../constants/dimensions'
import Icon from './base/Icon'
import Link from './base/Link'
import TextButton from './base/TextButton'

const SecurityInformationContainer = styled.div`
  position: relative;
  display: flex;
`
const SecurityIconContainer = styled.button`
  align-self: center;
  margin-inline-start: 8px;
  cursor: pointer;
  display: flex;
  border: none;
  background-color: ${props => props.theme.colors.textSecondaryColor};
  padding: 0;
`

const SecurityIcon = styled(Icon)`
  width: 32px;
  height: 32px;
  color: ${props => props.theme.colors.textSecondaryColor};
`

const ChatSecurityInformation = (): ReactElement => {
  const { privacyUrls } = buildConfig()
  const privacyUrl = privacyUrls.default
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
