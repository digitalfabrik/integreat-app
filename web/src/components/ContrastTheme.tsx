import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ContrastIcon } from '../assets'
import { useContrastTheme } from '../hooks/useContrastTheme'
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

const StyledIcon = styled(Icon)<{ $isContrastTheme: boolean }>`
  width: 24px;
  height: 24px;
  transform: ${({ $isContrastTheme }) => ($isContrastTheme ? 'scaleX(-1)' : 'none')};
  transition: 'transform 0.2s ease';
`

const ContrastTheme = (): ReactElement => {
  const { t } = useTranslation('layout')
  const { viewportSmall } = useWindowDimensions()
  const { toggleContrastTheme, isContrastTheme } = useContrastTheme()

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggleContrastTheme()
    }
  }

  if (viewportSmall) {
    return (
      <ContrastButton
        dir='auto'
        role='button'
        aria-label={t('contrastMode')}
        tabIndex={0}
        onClick={toggleContrastTheme}
        onKeyDown={handleKeyDown}>
        <StyledIcon $isContrastTheme={isContrastTheme} src={ContrastIcon} />
        <span>{t('contrastMode')}</span>
      </ContrastButton>
    )
  }

  return <ToolbarItem icon={ContrastIcon} text={t('contrastMode')} onClick={toggleContrastTheme} id='contrast-mode' />
}

export default ContrastTheme
