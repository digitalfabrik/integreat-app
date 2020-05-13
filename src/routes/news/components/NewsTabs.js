// @flow

import * as React from 'react'
import styled from 'styled-components'
import { CityModel } from '@integreat-app/integreat-api-client'
import type { TFunction } from 'react-i18next'
import Tab from './Tab'
import { LOCAL_NEWS, TUNEWS } from '../constants'

const StyledTabs = styled.div`
  display: flex;
  padding-top: 45px;
  padding-bottom: 40px;
`

type PropsType = {|
  type: string,
  children: React.Node,
  city: string,
  cities: Array<CityModel>,
  language: string,
  t: TFunction
|}

class NewsTabs extends React.PureComponent<PropsType> {
  render () {
    const { children, city, cities, language, t, type } = this.props
    const currentCity: CityModel = cities && cities.find(cityElement => cityElement.code === city)

    return (
      <>
        <StyledTabs>
          {
            currentCity && currentCity.pushNotificationsEnabled && <Tab active={type === LOCAL_NEWS} type={LOCAL_NEWS} destination={`/${city}/${language}/news/local`} t={t} />
          }
          {
            currentCity && currentCity.tunewsEnabled && <Tab active={type === TUNEWS} type={TUNEWS} destination={`/${city}/${language}/news/tu-news`} t={t} />
          }
        </StyledTabs>
        {children}
      </>
    )
  }
}

export default NewsTabs
