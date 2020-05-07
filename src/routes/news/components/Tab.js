// @flow

import React from 'react'
import styled from 'styled-components'
import Link from 'redux-first-router-link'
import { TFunction } from 'i18next'
import tunewsLogoActive from '../assets/tu-news-active.png'
import tunewsLogoInActive from '../assets/tu-news-inactive.png'

const TU_NEWS = 'tu'

const NewsLink = ({ active, ...props }) => <Link {...props} />

const StyledTab = styled(NewsLink)`
  cursor: pointer;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 47px;
  padding: 13px 15px;
  flex-shrink: 0;
  object-fit: contain;
  background-color: ${({ active, theme }) =>
    active ? theme.colors.themeColor : 'rgba(111, 111, 110, 0.4)'};
  border-radius: 11px;
  margin-right: 30px;
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  width: 160px;
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
