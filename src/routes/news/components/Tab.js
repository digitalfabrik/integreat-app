// @flow

import React from 'react'
import styled from 'styled-components'
import tuNewsLogoActive from '../assets/tu-news-active.png'
import tuNewsLogoInActive from '../assets/tu-news-inactive.png'

const TU_NEWS = 'tu'
const decideColor = (activeTab, label, theme) => {
  let color
  if (activeTab.toLowerCase() !== 'news') {
    color = theme.colors.themeColor
  } else {
    color = theme.colors.tuNewsColor
  }
  return color
}

const StyledTab = styled.div`
  cursor: pointer;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 47px;
  padding: 13px 15px;
  flex-shrink: 0;
  object-fit: contain;
  background-color: ${({ activeTab, label, theme }) =>
    activeTab === label ? decideColor(activeTab, label, theme) : 'rgba(111, 111, 110, 0.4)'};
  border-radius: 11px;
  margin-right: 30px;
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
`

const TuStyledTab = styled(StyledTab)`
  
  background-image: url(${tuNewsLogoActive});
  background-image: ${({ activeTab, label, theme }) =>
    activeTab === label ? `url(${tuNewsLogoActive})` : `url(${tuNewsLogoInActive})`};
  background-size: cover;
  width: 150px;
`

type PropsType = {|
  label: string,
  activeTab: string,
  onClick: string => void
|}

class Tab extends React.PureComponent<PropsType> {
  onClick = () => {
    const { label, onClick } = this.props
    onClick(label)
  }

  render () {
    const {
      onClick,
      props: { activeTab, label, type }
    } = this

    if (type === TU_NEWS) {
      return (
        <TuStyledTab onClick={onClick} activeTab={activeTab} label={label} />
      )
    }

    return (
      <StyledTab onClick={onClick} activeTab={activeTab} label={label}>
        {label}
      </StyledTab>
    )
  }
}

export default Tab
