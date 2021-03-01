// @flow

import { useEffect } from 'react'
import { pathToAction, redirect, type Action } from 'redux-first-router'
import { connect } from 'react-redux'
import type { Dispatch } from 'redux'
import type { StateType } from '../../../modules/app/StateType'
import { useTranslation } from 'react-i18next'
import { routesMap } from '../../../modules/app/route-configs/index'
import LandingRouteConfig from '../../../modules/app/route-configs/LandingRouteConfig'
import CategoriesRouteConfig from '../../../modules/app/route-configs/CategoriesRouteConfig'
import { CityModel } from 'api-client'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import buildConfig from '../../../modules/app/constants/buildConfig'
import { NOT_FOUND_ROUTE } from '../../../modules/app/route-configs/NotFoundRouteConfig'

type OwnPropsType = {|
  cities: Array<CityModel>
|}

type PropsType = {|
  ...OwnPropsType,
  redirect: Action => void,
  param?: string
|}

/**
 * Adds the language code at the end of the current path
 */
const I18nRedirectPage = (props: PropsType) => {
  const { redirect, param, cities } = props
  const { i18n } = useTranslation()

  const getRedirectPath = (): string => {
    const fixedCity = buildConfig().featureFlags.fixedCity
    if (fixedCity) {
      // Redirect to the dashboard of the selected city
      if (!param || param === 'landing' || param === fixedCity) {
        return new CategoriesRouteConfig().getRoutePath({ city: fixedCity, language: i18n.language })
      }

      // Redirect to a not found page if the param is not a valid city
      return NOT_FOUND_ROUTE
    }

    // The param does not exist (or is 'landing'), so redirect to the landing page with the detected language
    if (!param || param === 'landing') {
      return new LandingRouteConfig().getRoutePath({ language: i18n.language })
    }

    // The param is a valid city, so redirect to the categories route with the detected language
    if (cities.find(_city => _city.code === param)) {
      return new CategoriesRouteConfig().getRoutePath({ city: param, language: i18n.language })
    }

    return NOT_FOUND_ROUTE
  }

  useEffect(() => {
    redirect(pathToAction(getRedirectPath(), routesMap))
  }, [])

  return null
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>) => ({
  redirect: (action: Action) => { dispatch(redirect(action)) }
})

const mapStateToProps = (state: StateType) => ({
  param: state.location.payload.param
})

export default connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps, mapDispatchToProps)(I18nRedirectPage)
