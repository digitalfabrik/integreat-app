// @flow

import React from 'react'
import styled from 'styled-components'
import Link from 'redux-first-router-link'
import { TFunction } from 'i18next'
import tunewsLogoActive from '../assets/TunewsActiveLogo.png'
import tunewsLogoInactive from '../assets/TunewsInactiveLogo.png'
import { TU_NEWS } from '../constants'

const NewsLink = ({ active, ...props }) => <Link {...props} />

const StyledTab = styled(NewsLink)`
  display: flex;
  width: 160px;
  height: 49px;
  box-sizing: border-box;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  margin-right: 30px;
  cursor: pointer;
  padding: 13px 15px;
  color: ${({ theme }) => (theme.colors.backgroundColor)};
  object-fit: contain;
  background-color: ${({ active, theme }) =>
    active ? theme.colors.themeColor : theme.colors.textDisabledColor};
  border-radius: 11px;
  font-size: 18px;
  font-weight: 700;
  text-decoration: none;
`

const TuStyledTab = styled(StyledTab)`
  background-image: ${({ active, theme }) =>
    active ? `url(${tunewsLogoActive})` : `url(${tunewsLogoInactive})`};
  background-color: ${({ active, theme }) =>
    active ? theme.colors.tunewsThemeColor : theme.colors.textDisabledColor};
  background-size: cover;
  background-position: center center;
`

type PropsType = {|
  type: string,
  active: boolean,
  destination: string,
  t: TFunction
|}

class Tab extends React.PureComponent<PropsType> {
  render () {
    const { type, active, destination, t } = this.props

    if (type === TU_NEWS) {
      return (
        <TuStyledTab active={active} to={destination} />
      )
    }

    return (
      <StyledTab active={active} to={destination}>
        {t('local').toUpperCase()}
      </StyledTab>
    )
  }
}

export default Tab
