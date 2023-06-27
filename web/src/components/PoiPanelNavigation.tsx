import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { UiDirectionType } from 'translations'

import iconArrowBack from '../assets/IconArrowBack.svg'
import iconArrowForward from '../assets/IconArrowForward.svg'

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

const Icon = styled.img<{ direction: string }>`
  width: 16px;
  height: 14px;
  flex-shrink: 0;
  padding: 0 8px;
  object-fit: contain;
  align-self: center;
  ${props =>
    props.direction === 'rtl' &&
    css`
      transform: scaleX(-1);
    `};
`

type PoiPanelNavigationProps = {
  switchFeature: (step: 1 | -1) => void
  direction: UiDirectionType
}

const PoiPanelNavigation: React.FC<PoiPanelNavigationProps> = ({
  switchFeature,
  direction,
}: PoiPanelNavigationProps): ReactElement => {
  const { t } = useTranslation('pois')
  return (
    <NavigationContainer>
      <NavItem
        onClick={() => switchFeature(-1)}
        role='button'
        tabIndex={0}
        onKeyPress={() => switchFeature(-1)}
        aria-label='previous location'>
        <Icon src={iconArrowBack} alt='' direction={direction} />
        <Label>{t('detailsPreviousPoi')}</Label>
      </NavItem>
      <NavItem
        onClick={() => switchFeature(1)}
        role='button'
        tabIndex={0}
        onKeyPress={() => switchFeature(1)}
        aria-label='next location'>
        <Label>{t('detailsNextPoi')}</Label>
        <Icon src={iconArrowForward} alt='' direction={direction} />
      </NavItem>
    </NavigationContainer>
  )
}

export default PoiPanelNavigation
