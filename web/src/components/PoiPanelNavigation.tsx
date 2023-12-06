import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ArrowBackIcon } from '../assets'
import { helpers } from '../constants/theme'
import Button from './base/Button'
import Icon from './base/Icon'

const NavigationContainer = styled.div`
  display: flex;
  padding: 12px;
  justify-content: space-between;
`

const StyledButton = styled(Button)`
  display: flex;
`

const Label = styled.span`
  align-self: center;
  ${helpers.adaptiveFontSize};
`

const StyledIcon = styled(Icon)`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  padding: 0 8px;
  object-fit: contain;
  align-self: center;
`

type PoiPanelNavigationProps = {
  switchPoi: (step: 1 | -1) => void
}

const PoiPanelNavigation = ({ switchPoi }: PoiPanelNavigationProps): ReactElement => {
  const { t } = useTranslation('pois')
  return (
    <NavigationContainer>
      <StyledButton onClick={() => switchPoi(-1)} tabIndex={0} ariaLabel={t('previousPoi')}>
        <StyledIcon src={ArrowBackIcon} directionDependent />
        <Label>{t('detailsPreviousPoi')}</Label>
      </StyledButton>
      <StyledButton onClick={() => switchPoi(1)} tabIndex={0} ariaLabel={t('nextPoi')}>
        <Label>{t('detailsNextPoi')}</Label>
        <StyledIcon src={ArrowBackIcon} directionDependent reverse />
      </StyledButton>
    </NavigationContainer>
  )
}

export default PoiPanelNavigation
