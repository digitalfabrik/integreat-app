// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import { CityModel } from '@integreat-app/integreat-api-client'
import type { StateType } from '../../../modules/app/StateType'
import { redirect } from 'redux-first-router'
import type { Dispatch } from 'redux'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import { TUNEWS_LIST_ROUTE } from './../../../modules/app/route-configs/TuNewsListRouteConfig'
import { TUNEWS_DETAILS_ROUTE } from './../../../modules/app/route-configs/TuNewsDetailsRouteConfig'
import { CATEGORIES_ROUTE } from './../../../modules/app/route-configs/CategoriesRouteConfig'
import { NEWS_ROUTE } from './../../../modules/app/route-configs/NewsRouteConfig'
import { LOCAL_NEWS_DETAILS_ROUTE } from './../../../modules/app/route-configs/LocalNewsDetailsRouteConfig'

type PropsType = {|
  location: any,
  city: string,
  language: string,
  cities: Array<CityModel>,
  redirect: any,
  children: React.Node
|}

export class NewsController extends React.Component<PropsType> {

  componentDidMount() {

    const currentCity: any = this.props.cities.find(cityElement => cityElement._code === this.props.city) || {}

    if (!currentCity.newsEnabled && !currentCity.tuNewsEnabled) {
      this.props.redirect({ payload: { language: this.props.language, city: this.props.city }, type: CATEGORIES_ROUTE })
    }
    else if (!currentCity.newsEnabled && currentCity.tuNewsEnabled) {
      if (this.props.location.type === TUNEWS_DETAILS_ROUTE) {
        return;
      }

      this.props.redirect({ payload: { language: this.props.language, city: this.props.city }, type: TUNEWS_LIST_ROUTE })
    }
    else if (currentCity.newsEnabled && !currentCity.tuNewsEnabled) {
      if (this.props.location.type === LOCAL_NEWS_DETAILS_ROUTE) {
        return;
      }

      this.props.redirect({ payload: { language: this.props.language, city: this.props.city }, type: NEWS_ROUTE })
    }
  }

  render() {
    const { children } = this.props;
    return (
      <div>{children}</div>
    )
  }
}

const mapStateTypeToProps = (state: StateType) => {
  return {
    location: state.location,
    language: state.location.payload.language,
    city: state.location.payload.city,
    cities: state.cities._data,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>) => ({
  redirect: action => dispatch(redirect(action))
})

export default connect<*, *, *, *, *, *>(mapStateTypeToProps, mapDispatchToProps)
(NewsController)

