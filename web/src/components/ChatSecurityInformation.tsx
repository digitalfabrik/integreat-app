import styled from '@emotion/styled'
import React, { ReactElement, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { DataSecurityIcon } from '../assets'
import dimensions from '../constants/dimensions'
import useOnClickOutside from '../hooks/useOnClickOutside'
import Icon from './base/Icon'

const SecurityInformationContainer = styled.div`
  position: relative;
  display: flex;
`
const SecurityIconContainer = styled.button`
  align-self: center;
  cursor: pointer;
  display: flex;
  border: none;
  background-color: transparent;
  padding: 0;
`

const SecurityIcon = styled(Icon)`
  width: 32px;
  height: 32px;
  color: ${props => props.theme.colors.textSecondaryColor};
`

const InformationTooltipContainer = styled.div`
  position: absolute;
  z-index: 2000;
  border: 1px solid;
  background-color: ${props => props.theme.colors.backgroundColor};
  color: ${props => props.theme.colors.textColor};
  padding: 12px;
  text-align: center;
  transform: translate(-95%, -90%);
  white-space: pre-line;
  width: 250px;

  @media ${dimensions.smallViewport} {
    width: 70vw;
  }
`

const ChatSecurityInformation = (): ReactElement => {
  const [securityInformationVisible, setSecurityInformationVisible] = useState(false)
  const securityInformationRef = useRef(null)
  useOnClickOutside(securityInformationRef, () => setSecurityInformationVisible(false))
  const { t } = useTranslation('chat')

  return (
    <SecurityInformationContainer ref={securityInformationRef}>
      {securityInformationVisible && <InformationTooltipContainer>{t('dataSecurity')}</InformationTooltipContainer>}
      <SecurityIconContainer onClick={() => setSecurityInformationVisible(!securityInformationVisible)}>
        <SecurityIcon src={DataSecurityIcon} />
      </SecurityIconContainer>
    </SecurityInformationContainer>
  )
}

export default ChatSecurityInformation
