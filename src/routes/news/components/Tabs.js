// @flow

import React from 'react'
import styled from 'styled-components'
import { CityModel } from '@integreat-app/integreat-api-client'
import type { TFunction } from 'react-i18next'
import Tab from './Tab'

const StyledTabs = styled.div`
  display: flex;
  padding-top: 45px;
  padding-bottom: 40px;
`

const LOCAL_NEWS = 'local'
const TU_NEWS = 'tu'

type PropsType = {|
  localNews: boolean,
  tunews: boolean,
  children: any,
  city: string,
  cities: Array<CityModel>,
  language: string,
  t: TFunction
|}

type StateType = {|
  location: any,
  cities: Array<CityModel>
|}

class Tabs extends React.PureComponent<PropsType, StateType> {
  render () {
    const { localNews, tunews, children, city, cities, language, t } = this.props
    const currentCity: CityModel = cities && cities.find(cityElement => cityElement._code === city)

    return (
      <>
        <StyledTabs>
          {
            currentCity && currentCity._pushNotificationsEnabled && <Tab active={!!localNews} type={LOCAL_NEWS} destination={`/${city}/${language}/news/local`} t={t} />
          }
          {
            currentCity && currentCity._tunewsEnabled && <Tab active={tunews} type={TU_NEWS} destination={`/${city}/${language}/news/tu-news`} t={t} />
          }
        </StyledTabs>
        {children}
      </>
    )
  }
}

export default Tabs
