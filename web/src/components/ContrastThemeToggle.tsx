import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ContrastIcon } from '../assets'
import { useContrastTheme } from '../hooks/useContrastTheme'
import useWindowDimensions from '../hooks/useWindowDimensions'
import ToolbarItem from './ToolbarItem'
import Button from './base/Button'
import Icon from './base/Icon'

const ContrastButton = styled(Button)`
  display: flex;
  width: 100%;
  padding: 24px 0;
  align-items: center;

  & > span {
    padding: 0 28px;
    color: ${props => props.theme.colors.textColor};
  }
`

const StyledIcon = styled(Icon)<{ $isContrastTheme: 'light' | 'contrast' }>`
  transform: ${({ $isContrastTheme }) => ($isContrastTheme === 'contrast' ? 'translateY(2px)' : 'none')};
  transition: transform 0.2s ease;
`

const ContrastThemeToggle = (): ReactElement => {
  const { t } = useTranslation('layout')
  const { viewportSmall } = useWindowDimensions()
  const { toggleTheme, themeType } = useContrastTheme()

  if (viewportSmall) {
    return (
      <ContrastButton label={t('contrastTheme')} onClick={toggleTheme}>
        <StyledIcon $isContrastTheme={themeType} src={ContrastIcon} />
        <span>{t('contrastTheme')}</span>
      </ContrastButton>
    )
  }

  return <ToolbarItem icon={ContrastIcon} text={t('contrastTheme')} onClick={toggleTheme} id='contrast-theme' />
}

export default ContrastThemeToggle
