// @flow

import React from 'react'
import styled from 'styled-components'
import tuNewsLogoActive from '../assets/tu-news-active.png'
import tuNewsLogoInActive from '../assets/tu-news-inactive.png'
import Link from 'redux-first-router-link'

const TU_NEWS = 'tu'

const decideColor = (active, theme) => {
  let color
  if (active) {
    color = theme.colors.themeColor
  } else {
    color = theme.colors.tuNewsColor
  }
  return color
}

const StyledTab = styled(Link)`
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
    active ? decideColor(active, theme) : 'rgba(111, 111, 110, 0.4)'};
  border-radius: 11px;
  margin-right: 30px;
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  width: 150px;
`

const TuStyledTab = styled(StyledTab)`
  background-image: url(${tuNewsLogoActive});
  background-image: ${({ active, theme }) =>
    active ? `url(${tuNewsLogoActive})` : `url(${tuNewsLogoInActive})`};
  background-size: cover;
`

type PropsType = {|
  type: string,
  active: boolean,
  destination: string,
|}

class Tab extends React.PureComponent<PropsType> {
  render () {
    const { type, active, destination } = this.props;

    if (type === TU_NEWS) {
      return (
        <TuStyledTab onClick={this.handleTuNewsClick} active={active} to={destination}/>
      )
    }

    return (
      <StyledTab active={active} to={destination}>
        LOCAL
      </StyledTab>
    )
  }
}

export default Tab
