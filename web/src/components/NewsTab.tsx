import shouldForwardProp from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import { TFunction } from 'i18next'
import React, { ReactElement } from 'react'
import { Link } from 'react-router-dom'

import { NewsType, TU_NEWS_TYPE } from 'shared'
import { tunewsLabel } from 'shared/constants/news'

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
  color: ${({ theme }) => theme.colors.backgroundColor};
  object-fit: contain;
  background-color: ${({ tabSelected, theme }) =>
    tabSelected ? theme.colors.themeColor : theme.colors.textDisabledColor};
  border-radius: 11px;
  font-size: ${props => props.theme.fonts.subTitleFontSize};
  font-weight: 700;
  text-decoration: none;

  &:not(:last-child) {
    margin-inline-end: 30px;
  }
`

const TuStyledTab = styled(StyledTab)`
  background-image: ${({ tabSelected }) => (tabSelected ? `url(${TuNewsActiveIcon})` : `url(${TuNewsInactiveIcon})`)};
  background-color: ${({ tabSelected, theme }) =>
    tabSelected ? theme.colors.tunewsThemeColor : theme.colors.textDisabledColor};
  background-size: cover;
  background-position: center center;
`

type NewsTabProps = {
  type: NewsType
  active: boolean
  destination: string
  t: TFunction<'news'>
}

const NewsTab = ({ type, active, destination, t }: NewsTabProps): ReactElement => {
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
