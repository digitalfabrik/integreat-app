import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ContrastModeIcon } from '../assets'
import useWindowDimensions from '../hooks/useWindowDimensions'
import ToolbarItem from './ToolbarItem'
import Icon from './base/Icon'

const ContrastButton = styled.div`
  display: flex;
  width: 100%;
  padding: 24px 0;
  align-items: center;
  cursor: pointer;

  & > span {
    padding: 0 28px;
    color: ${props => props.theme.colors.textColor};
  }
`

const StyledIcon = styled(Icon)`
  width: 24px;
  height: 24px;
`

const HighContrastMode = (): ReactElement => {
  const { t } = useTranslation('layout')
  const { viewportSmall } = useWindowDimensions()

  const handleContrastToggle = () => {
    // Needs to be implemented in another ticket #3187
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleContrastToggle()
    }
  }

  if (viewportSmall) {
    return (
      <ContrastButton
        dir='auto'
        role='button'
        aria-label={t('contrastMode')}
        tabIndex={0}
        onClick={handleContrastToggle}
        onKeyDown={handleKeyDown}>
        <StyledIcon src={ContrastModeIcon} />
        <span>{t('contrastMode')}</span>
      </ContrastButton>
    )
  }

  return (
    <ToolbarItem icon={ContrastModeIcon} text={t('contrastMode')} onClick={handleContrastToggle} id='contrast-mode' />
  )
}

export default HighContrastMode
