// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import { CityModel } from '@integreat-app/integreat-api-client'
import type { ReceivedAction } from 'redux-first-router'
import { redirect } from 'redux-first-router'
import type { Dispatch } from 'redux'
import type { StateType } from '../../../modules/app/StateType'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import { TUNEWS_LIST_ROUTE } from './../../../modules/app/route-configs/TunewsListRouteConfig'
import { TUNEWS_DETAILS_ROUTE } from './../../../modules/app/route-configs/TunewsDetailsRouteConfig'
import { CATEGORIES_ROUTE } from './../../../modules/app/route-configs/CategoriesRouteConfig'
import { NEWS_ROUTE } from './../../../modules/app/route-configs/NewsRouteConfig'
import { LOCAL_NEWS_DETAILS_ROUTE } from './../../../modules/app/route-configs/LocalNewsDetailsRouteConfig'

type PropsType = {|
  type: string,
  city: string,
  language: string,
  cities: Array<CityModel>,
  redirect: ReceivedAction => void,
  children: React.Node
|}

export class NewsController extends React.Component<PropsType> {
  componentDidMount () {
    this.handleRedirect()
  }

  handleRedirect = () => {
    const { type, language, city, cities, redirect } = this.props
    const currentCity: CityModel = cities && cities.find(cityElement => cityElement._code === city)

    if (currentCity && !currentCity.pushNotificationsEnabled && !currentCity.tunewsEnabled) {
      redirect({ payload: { language: language, city: city }, type: CATEGORIES_ROUTE })
    } else if (currentCity && !currentCity.pushNotificationsEnabled && currentCity.tunewsEnabled) {
      if (type === TUNEWS_DETAILS_ROUTE) {
        return
      }
      redirect({ payload: { language: language, city: city }, type: TUNEWS_LIST_ROUTE })
    } else if (currentCity && currentCity.pushNotificationsEnabled && !currentCity.tunewsEnabled) {
      if (type === LOCAL_NEWS_DETAILS_ROUTE) {
        return
      }
      redirect({ payload: { language: language, city: city }, type: NEWS_ROUTE })
    }
  }

  render () {
    const { children } = this.props
    return (
      <div>{children}</div>
    )
  }
}

const mapStateTypeToProps = (state: StateType) => {
  return {
    type: state.location.type,
    language: state.location.payload.language,
    city: state.location.payload.city,
    cities: state.cities.data
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>) => ({
  redirect: action => dispatch(redirect(action))
})

export default connect<*, *, *, *, *, *>(mapStateTypeToProps, mapDispatchToProps)(NewsController)
