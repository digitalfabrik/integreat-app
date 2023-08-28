import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ArrowBackIcon } from '../assets'
import Icon from './base/Icon'

const NavigationContainer = styled.div`
  display: flex;
  padding: 12px;
  justify-content: space-between;
`

const NavItem = styled.div`
  display: flex;
  cursor: pointer;
`

const Label = styled.span`
  align-self: center;
  font-size: clamp(
    ${props => props.theme.fonts.adaptiveFontSizeSmall.min},
    ${props => props.theme.fonts.adaptiveFontSizeSmall.value},
    ${props => props.theme.fonts.adaptiveFontSizeSmall.max}
  );
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
      <NavItem
        onClick={() => switchPoi(-1)}
        role='button'
        tabIndex={0}
        onKeyPress={() => switchPoi(-1)}
        aria-label='previous location'>
        <StyledIcon src={ArrowBackIcon} directionDependent />
        <Label>{t('detailsPreviousPoi')}</Label>
      </NavItem>
      <NavItem
        onClick={() => switchPoi(1)}
        role='button'
        tabIndex={0}
        onKeyPress={() => switchPoi(1)}
        aria-label='next location'>
        <Label>{t('detailsNextPoi')}</Label>
        <StyledIcon src={ArrowBackIcon} directionDependent reverse />
      </NavItem>
    </NavigationContainer>
  )
}

export default PoiPanelNavigation
