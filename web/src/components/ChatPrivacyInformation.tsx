import styled from '@emotion/styled'
import React, { ReactElement, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { MailLockIcon } from '../assets'
import buildConfig from '../constants/buildConfig'
import useOnClickOutside from '../hooks/useOnClickOutside'
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
  background-color: ${props =>
    props.theme.isContrastTheme ? props.theme.colors.backgroundColor : props.theme.colors.textSecondaryColor};
  border-radius: 0.25em;
`

const SecurityIcon = styled(Icon)`
  width: 100%;
  height: 100%;
  color: ${props => props.theme.colors.textSecondaryColor};
`

type ChatPrivacyInformationProps = {
  customPrivacyUrl: string | null
}

const ChatPrivacyInformation = ({ customPrivacyUrl }: ChatPrivacyInformationProps): ReactElement => {
  const [securityInformationVisible, setSecurityInformationVisible] = useState<boolean>(false)
  const privacyInformationRef = useRef(null)
  useOnClickOutside(privacyInformationRef, () => setSecurityInformationVisible(false))

  const { privacyUrls } = buildConfig()
  const privacyUrl = customPrivacyUrl ?? privacyUrls.default

  return (
    <PrivacyInformationContainer ref={privacyInformationRef}>
      <SecurityIconContainer onClick={() => setSecurityInformationVisible(!securityInformationVisible)}>
        <Link to={privacyUrl}>
          <SecurityIcon src={MailLockIcon} />
        </Link>
      </SecurityIconContainer>
    </PrivacyInformationContainer>
  )
}

export default ChatPrivacyInformation
