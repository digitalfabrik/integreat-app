// @flow

import React from 'react'
import styled from 'styled-components'
import Tab from './Tab'
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
  language: string
|}

type StateType = {|
  location: any,
  cities: Array<CityModel>
|}

class Tabs extends React.PureComponent<PropsType, StateType> {
  render () {
    const { localNews, tuNews, children, city, cities, language, t } = this.props
    const currentCity: CityModel = cities && cities.find(cityElement => cityElement._code === city)

    return (
      <>
        <StyledTabs>
          {
            currentCity && currentCity._pushNotificationsEnabled && <Tab active={localNews} type={LOCAL_NEWS} destination={`/${city}/${language}/news/local`} t={t} />
          }
          {
            currentCity && currentCity._tunewsEnabled && <Tab active={tuNews} type={TU_NEWS} destination={`/${city}/${language}/news/tu-news`} t={t} />
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
    city: state.location.payload.city,
    cities: state.cities._data
  }
}

export default compose(
  connect<*, *, *, *, *, *>(mapStateTypeToProps, { fetchTuNews }),
  withTranslation('news')
)(Tabs)
