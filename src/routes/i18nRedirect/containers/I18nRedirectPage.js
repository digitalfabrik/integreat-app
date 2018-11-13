// @flow

import React from 'react'
import type { Action } from 'redux-first-router'
import { redirect } from 'redux-first-router'
import { connect } from 'react-redux'
import CityModel from '../../../modules/endpoint/models/CityModel'
import { goToLanding } from '../../../modules/app/routes/landing'
import { goToCategories } from '../../../modules/app/routes/categories'
import { goToNotFound } from '../../../modules/app/routes/notFound'
import type { Dispatch } from 'redux'
import type { StateType } from '../../../modules/app/StateType'
import { withI18n } from 'react-i18next'
import i18n from 'i18next'
import { compose } from 'recompose'

type PropsType = {|
  redirect: Action => void,
  cities: Array<CityModel>,
  param?: string,
  i18n: i18n
|}

/**
 * Adds the language code at the end of the current path
 */
export class I18nRedirectPage extends React.Component<PropsType> {
  getRedirectAction (): Action {
    const {param, cities, i18n} = this.props
    // the param does not exist (or is 'landing'), so redirect to the landing page with the detected language
    if (!param || param === 'landing') {
      return goToLanding(i18n.language)
    }

    // the param is a valid city, so redirect to the categories route with the detected language
    if (cities.find(_city => _city.code === param)) {
      return goToCategories(param, i18n.language)
    }

    return goToNotFound()
  }

  componentDidMount () {
    this.props.redirect(this.getRedirectAction())
  }

  render () {
    return null
  }
}

const mapDispatchToProps = (dispatch: Dispatch<*>) => ({
  redirect: action => dispatch(redirect(action))
})

const mapStateToProps = (state: StateType) => ({
  param: state.location.payload.param
})

export default compose(
  withI18n(),
  connect(mapStateToProps, mapDispatchToProps)
)(I18nRedirectPage)
