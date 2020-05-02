// @flow

import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Tab from './Tab'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import compose from 'lodash/fp/compose'
import { connect } from 'react-redux'
import { CityModel } from '@integreat-app/integreat-api-client'
import { fetchTuNews } from '../actions/fetchTuNews'

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
  cities: Array<CityModel>,
  language: string,
|}

type StateType = {|
  location: any,
  cities: Array<CityModel>,
|}

class Tabs extends React.PureComponent<PropsType, StateType> {
  render() {
    const { localNews, tuNews, children, city, cities, language } = this.props
    const currentCity:any = cities.find(cityElement => cityElement._code === city)

    return (
      <>
        <StyledTabs>
          {
            currentCity._newsEnabled && <Tab active={localNews} type={LOCAL_NEWS} destination={`/${city}/${language}/news/local`} />
          }
          {
            currentCity._tuNewsEnabled && <Tab active={tuNews} type={TU_NEWS} destination={`/${city}/${language}/news/tu-news`} />
          }
        </StyledTabs>
        {children}
      </>
    )
  }
}

const mapStateTypeToProps = (state: StateType) => {
  return {
    language: state.location.payload.language,
    prevLanguage: state.location.prev.payload.language,
    city: state.location.payload.city,
    cities: state.cities._data
  }
}

export default compose(
  connect<*, *, *, *, *, *>(mapStateTypeToProps, { fetchTuNews }),
  withTranslation('news')
)(Tabs)
