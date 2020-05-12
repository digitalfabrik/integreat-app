// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import { CityModel } from '@integreat-app/integreat-api-client'
import type { ReceivedAction } from 'redux-first-router'
import { redirect } from 'redux-first-router'
import type { Dispatch } from 'redux'
import type { StateType } from '../../../modules/app/StateType'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import { TUNEWS_ROUTE } from './../../../modules/app/route-configs/TunewsRouteConfig'
import { TUNEWS_DETAILS_ROUTE } from './../../../modules/app/route-configs/TunewsDetailsRouteConfig'
import { CATEGORIES_ROUTE } from './../../../modules/app/route-configs/CategoriesRouteConfig'
import { LOCAL_NEWS_ROUTE } from './../../../modules/app/route-configs/LocalNewsRouteConfig'
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
    const currentCity: CityModel = cities && cities.find(cityElement => cityElement.code === city)

    if (currentCity && !currentCity.pushNotificationsEnabled && !currentCity.tunewsEnabled) {
      // if both pushNotifications and tunews are not enabled redirect to categories route
      redirect({ payload: { language: language, city: city }, type: CATEGORIES_ROUTE })
    } else if (currentCity && !currentCity.pushNotificationsEnabled && currentCity.tunewsEnabled) {
      // if tunews only is enabled and it's not tunewsDetails route redirect to tunews route
      if (type === TUNEWS_DETAILS_ROUTE) {
        return
      }
      redirect({ payload: { language: language, city: city }, type: TUNEWS_ROUTE })
    } else if (currentCity && currentCity.pushNotificationsEnabled && !currentCity.tunewsEnabled) {
      // if localnews is enabled only and it's not localNewsDetails route redirect to localNews route
      if (type === LOCAL_NEWS_DETAILS_ROUTE) {
        return
      }
      redirect({ payload: { language: language, city: city }, type: LOCAL_NEWS_ROUTE })
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
