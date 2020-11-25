// @flow

import React from 'react'
import type { ReceivedAction } from 'redux-first-router'
import { NOT_FOUND, pathToAction, redirect } from 'redux-first-router'
import { connect } from 'react-redux'
import type { Dispatch } from 'redux'
import type { StateType } from '../../../modules/app/StateType'
import { withTranslation } from 'react-i18next'
import i18n from 'i18next'
import { routesMap } from '../../../modules/app/route-configs/index'
import LandingRouteConfig from '../../../modules/app/route-configs/LandingRouteConfig'
import CategoriesRouteConfig from '../../../modules/app/route-configs/CategoriesRouteConfig'
import { CityModel } from 'api-client'
import type { StoreActionType } from '../../../modules/app/StoreActionType'

type PropsType = {|
  redirect: ReceivedAction => void,
  cities: Array<CityModel>,
  param?: string,
  i18n: i18n
|}

/**
 * Adds the language code at the end of the current path
 */
export class I18nRedirectPage extends React.Component<PropsType> {
  getRedirectPath (): string {
    const { param, cities, i18n } = this.props
    // the param does not exist (or is 'landing'), so redirect to the landing page with the detected language
    if (!param || param === 'landing') {
      return new LandingRouteConfig().getRoutePath({ language: i18n.language })
    }

    // the param is a valid city, so redirect to the categories route with the detected language
    if (cities.find(_city => _city.code === param)) {
      return new CategoriesRouteConfig().getRoutePath({ city: param, language: i18n.language })
    }

    return NOT_FOUND
  }

  componentDidMount () {
    this.props.redirect(pathToAction(this.getRedirectPath(), routesMap))
  }

  render () {
    return null
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>) => ({
  redirect: action => dispatch(redirect(action))
})

const mapStateToProps = (state: StateType) => ({
  param: state.location.payload.param
})

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(
    I18nRedirectPage
  ))
