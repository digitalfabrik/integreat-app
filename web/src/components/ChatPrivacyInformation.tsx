import styled from '@emotion/styled'
import React, { ReactElement } from 'react'

import { MailLockIcon } from '../assets'
import buildConfig from '../constants/buildConfig'
import Icon from './base/Icon'
import Link from './base/Link'

const PrivacyPolicyLink = styled(Link)`
  display: flex;
  width: 32px;
  height: 32px;
  align-self: center;
  margin-inline-start: 8px;
  cursor: pointer;
  border: none;
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
  const { privacyUrls } = buildConfig()
  const privacyUrl = customPrivacyUrl ?? privacyUrls.default

  return (
    <PrivacyPolicyLink to={privacyUrl}>
      <SecurityIcon src={MailLockIcon} />
    </PrivacyPolicyLink>
  )
}

export default ChatPrivacyInformation
