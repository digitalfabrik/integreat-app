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
const SecurityIconContainer = styled.button`
  align-self: center;
  margin-inline-start: 8px;
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

const InformationTooltipContainer = styled.div<{ $isRtl: boolean }>`
  position: absolute;
  z-index: 2000;
  border: 1px solid;
  background-color: ${props => props.theme.colors.textSecondaryColor};
  color: white;
  padding: 12px;
  text-align: center;
  transform: ${props => (props.$isRtl ? 'translate(95%, -90%)' : 'translate(-95%, -90%)')};
  white-space: pre-line;
  width: 250px;

  @media ${dimensions.smallViewport} {
    width: 70vw;
  }
`

const ChatSecurityInformation = (): ReactElement => {
  const { t, i18n } = useTranslation('chat')
  const [securityInformationVisible, setSecurityInformationVisible] = useState<boolean>(false)
  const isRtl = i18n.dir() === 'rtl'

  return (
    <SecurityInformationContainer>
      {securityInformationVisible && (
        <InformationTooltipContainer $isRtl={isRtl}>{t('dataSecurity')}</InformationTooltipContainer>
      )}
      <SecurityIconContainer onClick={() => setSecurityInformationVisible(!securityInformationVisible)}>
        <SecurityIcon src={DataSecurityIcon} />
      </SecurityIconContainer>
    </SecurityInformationContainer>
  )
}

export default ChatSecurityInformation
