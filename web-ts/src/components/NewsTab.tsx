import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { TFunction } from 'react-i18next'
import tunewsLogoActive from '../assets/TunewsActiveLogo.png'
import tunewsLogoInactive from '../assets/TunewsInactiveLogo.png'
import { Link } from 'react-router-dom'
import { NewsType, TU_NEWS_TYPE } from 'api-client'

const StyledTab = styled(Link)<{ $active: boolean }>`
  display: flex;
  width: 160px;
  height: 50px;
  box-sizing: border-box;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  margin-right: 30px;
  cursor: pointer;
  padding: 13px 15px;
  color: ${({ theme }) => theme.colors.backgroundColor};
  object-fit: contain;
  background-color: ${({ $active, theme }) => ($active ? theme.colors.themeColor : theme.colors.textDisabledColor)};
  border-radius: 11px;
  font-size: 18px;
  font-weight: 700;
  text-decoration: none;
`

const TuStyledTab = styled(StyledTab)`
  background-image: ${({ $active }) => ($active ? `url(${tunewsLogoActive})` : `url(${tunewsLogoInactive})`)};
  background-color: ${({ $active, theme }) => ($active ? theme.colors.tunewsThemeColor : theme.colors.textDisabledColor)};
  background-size: cover;
  background-position: center center;
`

type PropsType = {
  type: NewsType,
  active: boolean,
  destination: string,
  t: TFunction
}

const NewsTab = ({ type, active, destination, t }: PropsType): ReactElement => {
  if (type === TU_NEWS_TYPE) {
    return <TuStyledTab $active={active} to={destination} aria-label={t('tuNews')} />
  }

  return (
    <StyledTab $active={active} to={destination} aria-label={t('local')}>
      {t('local').toUpperCase()}
    </StyledTab>
  )
}

export default NewsTab
