// @flow

import React from 'react'
import styled from 'styled-components'
import Link from 'redux-first-router-link'
import { TFunction } from 'i18next'
import tunewsLogoActive from '../assets/TunewsActiveLogo.png'
import tunewsLogoInActive from '../assets/TunewsInactiveLogo.png'

const TU_NEWS = 'tu'

const NewsLink = ({ active, ...props }) => <Link {...props} />

const StyledTab = styled(NewsLink)`
  display: flex;
  width: 160px;
  height: 47px;
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
    active ? theme.colors.themeColor : 'rgba(111, 111, 110, 0.4)'};
  border-radius: 11px;
  font-size: 18px;
  font-weight: 700;
  text-decoration: none;
`

const TuStyledTab = styled(StyledTab)`
  background-color: ${({ active, theme }) =>
    active ? '#0179a6' : 'rgba(111, 111, 110, 0.4)'};
  background-image: ${({ active, theme }) =>
    active ? `url(${tunewsLogoActive})` : `url(${tunewsLogoInActive})`};
  background-size: cover;
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
        <div>
          <TuStyledTab active={active} to={destination} />
        </div>
      )
    }

    return (
      <StyledTab active={active} to={destination}>
        {t('local')}
      </StyledTab>
    )
  }
}

export default Tab
