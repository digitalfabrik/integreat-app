import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ContrastModeLightIcon } from '../assets'
import useWindowDimensions from '../hooks/useWindowDimensions'
import ToolbarItem from './ToolbarItem'
import Icon from './base/Icon'

const ContrastButton = styled.div`
  display: flex;
  width: 100%;
  height: 70px;
  border-bottom: 1px solid ${props => props.theme.colors.themeColor};
  cursor: pointer;

  &:focus {
    outline: 3px solid;
    border-radius: 3px;
  }

  & > span {
    padding: 25px 28px;
    align-self: start;
    color: ${props => props.theme.colors.textColor};
  }
`

const StyledIcon = styled(Icon)`
  margin-top: 20px;
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
        role='button'
        aria-label={t('contrastMode')}
        tabIndex={0}
        onClick={handleContrastToggle}
        onKeyDown={handleKeyDown}>
        <StyledIcon src={ContrastModeLightIcon} />
        <span>{t('contrastMode')}</span>
      </ContrastButton>
    )
  }

  return (
    <ToolbarItem
      icon={ContrastModeLightIcon}
      text={t('contrastMode')}
      onClick={handleContrastToggle}
      id='contrast-mode'
    />
  )
}

export default HighContrastMode
