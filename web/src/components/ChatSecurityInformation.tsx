import styled from '@emotion/styled'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import dimensions from '../constants/dimensions'
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
  width: 24px;
  height: 24px;
  color: ${props => props.theme.colors.textSecondaryColor};
  border-radius: 50%;
  border-color: ${props => props.theme.colors.textSecondaryColor};
  border-style: solid;
  padding: 4px;
`

const InformationTooltipContainer = styled.div`
  position: absolute;
  z-index: 2000;
  border: 1px solid;
  background-color: ${props =>
    props.theme.isContrastTheme ? props.theme.colors.backgroundColor : props.theme.colors.textSecondaryColor};
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
  const { t } = useTranslation('chat')
  const [securityInformationVisible, setSecurityInformationVisible] = useState<boolean>(false)

  return (
    <SecurityInformationContainer>
      {securityInformationVisible && <InformationTooltipContainer>{t('dataSecurity')}</InformationTooltipContainer>}
      <SecurityIconContainer onClick={() => setSecurityInformationVisible(!securityInformationVisible)}>
        <SecurityIcon src={LockOutlinedIcon} />
      </SecurityIconContainer>
    </SecurityInformationContainer>
  )
}

export default ChatSecurityInformation
