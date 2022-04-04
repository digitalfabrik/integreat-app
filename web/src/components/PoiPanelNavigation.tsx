import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import iconArrowBack from '../assets/IconArrowBack.svg'
import iconArrowForward from '../assets/IconArrowForward.svg'

const NavigationContainer = styled.div`
  display: flex;
  padding: 16px;
  justify-content: space-between;
`

const NavItem = styled.div`
  display: flex;
  cursor: pointer;
`

const Label = styled.span`
  align-self: center;
  font-size: clamp(0.55rem, 1.6vh, ${props => props.theme.fonts.hintFontSize});
`

const Icon = styled.img`
  width: 16px;
  height: 14px;
  flex-shrink: 0;
  padding: 0 8px;
  object-fit: contain;
  align-self: center;
`

type PoiPanelNavigationProps = { switchFeature: (step: number) => void }

const PoiPanelNavigation: React.FC<PoiPanelNavigationProps> = ({
  switchFeature
}: PoiPanelNavigationProps): ReactElement => {
  const { t } = useTranslation('pois')
  return (
    <NavigationContainer>
      <NavItem
        onClick={() => switchFeature(-1)}
        role='button'
        tabIndex={0}
        onKeyPress={() => switchFeature(-1)}
        aria-label='back-panel'>
        <Icon src={iconArrowBack} alt='' />
        <Label>{t('detailsPreviousPoi')}</Label>
      </NavItem>
      <NavItem
        onClick={() => switchFeature(1)}
        role='button'
        tabIndex={0}
        onKeyPress={() => switchFeature(1)}
        aria-label='forward-panel'>
        <Label>{t('detailsNextPoi')}</Label>
        <Icon src={iconArrowForward} alt='' />
      </NavItem>
    </NavigationContainer>
  )
}

export default PoiPanelNavigation
