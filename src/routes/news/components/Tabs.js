// @flow

import React from 'react'
import styled from 'styled-components'
import Tab from './Tab'
import { CityModel } from '@integreat-app/integreat-api-client'

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
            currentCity && currentCity._pushNotificationsEnabled && <Tab active={!!localNews} type={LOCAL_NEWS} destination={`/${city}/${language}/news/local`} t={t} />
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

export default Tabs
