import styled from '@emotion/styled'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { ContrastIcon } from '../assets'
import { useThemeContext } from '../hooks/useThemeContext'
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

const ContrastThemeToggle = (): ReactElement => {
  const { t } = useTranslation('layout')
  const { viewportSmall } = useWindowDimensions()
  const { toggleTheme } = useThemeContext()

  if (viewportSmall) {
    return (
      <ContrastButton label={t('contrastTheme')} onClick={toggleTheme}>
        <Icon src={ContrastIcon} />
        <span>{t('contrastTheme')}</span>
      </ContrastButton>
    )
  }

  return <ToolbarItem icon={ContrastIcon} text={t('contrastTheme')} onClick={toggleTheme} id='contrast-theme' />
}

export default ContrastThemeToggle
