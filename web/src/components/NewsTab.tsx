import shouldForwardProp from '@emotion/is-prop-valid'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { NewsType, TU_NEWS_TYPE, tunewsLabel } from 'shared'

import { TuNewsActiveIcon, TuNewsInactiveIcon } from '../assets'

const StyledTab = styled(Link, { shouldForwardProp })<{ tabSelected: boolean }>`
  display: flex;
  width: 160px;
  height: 50px;
  box-sizing: border-box;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 13px 15px;
  color: ${({ theme }) => theme.legacy.colors.backgroundColor};
  object-fit: contain;
  background-color: ${({ tabSelected, theme }) =>
    tabSelected ? theme.legacy.colors.themeColor : theme.legacy.colors.textDisabledColor};
  border-radius: 11px;
  font-size: ${props => props.theme.legacy.fonts.subTitleFontSize};
  font-weight: 700;
  text-decoration: none;
`

const TuStyledTab = styled(StyledTab)`
  background-image: ${({ tabSelected }) => (tabSelected ? `url(${TuNewsActiveIcon})` : `url(${TuNewsInactiveIcon})`)};
  background-color: ${({ tabSelected, theme }) =>
    tabSelected ? theme.legacy.colors.tunewsThemeColor : theme.legacy.colors.textDisabledColor};
  background-size: cover;
  background-position: center center;
`

type NewsTabProps = {
  type: NewsType
  active: boolean
  destination: string
}

const NewsTab = ({ type, active, destination }: NewsTabProps): ReactElement => {
  const { t } = useTranslation('news')
  if (type === TU_NEWS_TYPE) {
    return <TuStyledTab tabSelected={active} to={destination} aria-label={tunewsLabel} />
  }

  return (
    <StyledTab tabSelected={active} to={destination} aria-label={t('local')}>
      {t('local').toUpperCase()}
    </StyledTab>
  )
}

export default NewsTab
