// @flow

import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Tab from './Tab'
import compose from 'lodash/fp/compose'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'

const StyledTabs = styled.div`
  display: flex;
  padding-top: 45px;
  padding-bottom: 40px;
`

const LOCAL_NEWS = 'local'
const TU_NEWS = 'tu'

type PropsType = {|
  localNews: boolean,
  tuNews: boolean,
  children: any,
  city: string,
  language: string,
|}

type StateType = {|
  location: any
|}

class Tabs extends React.PureComponent<PropsType, StateType> {
  render () {
    const { localNews, tuNews, children, city, language } = this.props

    return (
      <>
        <StyledTabs>
          <Tab active={localNews} type={LOCAL_NEWS} destination={`/${city}/${language}/news/local`} />
          <Tab active={tuNews} type={TU_NEWS} destination={`/${city}/${language}/news/tu-news`} />
        </StyledTabs>
        {children}
      </>
    )
  }
}

const mapStateTypeToProps = (state: StateType) => {
  return {
    language: state.location.payload.language,
    city: state.location.payload.city,
    tuNewsList: state.tunewsList.data
  }
}

export default compose(
  connect<*, *, *, *, *, *>(mapStateTypeToProps),
  withTranslation('news')
)(Tabs)
