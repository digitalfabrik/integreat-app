import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { DataSecurityIcon } from '../assets'
import dimensions from '../constants/dimensions'
import Icon from './base/Icon'

const SecurityInformationContainer = styled.div`
  position: relative;
  display: flex;
`
const StyledIconContainer = styled.button`
  height: 24px;
  width: 24px;
  align-self: center;
  margin-left: 8px;
  cursor: pointer;
  display: flex;
  border: none;
  background-color: transparent;
  padding: 0;
`

const InformationTooltipContainer = styled.div`
  position: absolute;
  z-index: 2000;
  border: 1px solid;
  background-color: #585858;
  color: white;
  padding: 12px;
  text-align: center;
  transform: translate(-95%, -90%);
  white-space: pre-line;
  width: 250px;

  @media ${dimensions.smallViewport} {
    width: 70vw;
  }
`

const ChatbotSecurityInformation = (): ReactElement => {
  const { t } = useTranslation('chatbot')
  const [securityInformationVisible, setSecurityInformationVisible] = useState<boolean>(false)
  return (
    <SecurityInformationContainer>
      {securityInformationVisible && <InformationTooltipContainer>{t('dataSecurity')}</InformationTooltipContainer>}
      <StyledIconContainer onClick={() => setSecurityInformationVisible(!securityInformationVisible)}>
        <Icon src={DataSecurityIcon} />
      </StyledIconContainer>
    </SecurityInformationContainer>
  )
}

export default ChatbotSecurityInformation
