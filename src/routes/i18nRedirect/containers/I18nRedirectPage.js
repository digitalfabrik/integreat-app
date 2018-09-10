// @flow

import React from 'react'
import PropTypes from 'prop-types'
import type { Action } from 'redux-first-router'
import { redirect } from 'redux-first-router'
import { connect } from 'react-redux'
import CityModel from '../../../modules/endpoint/models/CityModel'
import { goToLanding } from '../../../modules/app/routes/landing'
import { goToCategories } from '../../../modules/app/routes/categories'
import { goToNotFound } from '../../../modules/app/routes/notFound'
import type { Dispatch } from 'redux'
import type { StateType } from '../../../modules/app/StateType'

type PropsType = {|
  redirect: Action => void,
  cities: ?Array<CityModel>,
  param?: string,
  // Custom redux state for testing purposes
  store?: StateType
|}

/**
 * Adds the language code at the end of the current path
 */
export class I18nRedirectPage extends React.Component<PropsType> {
  static contextTypes = {
    // we have to do this with PropTypes, because context is not known at compile time. A possible solution would be:
    // https://github.com/codemix/flow-runtime
    i18n: PropTypes.object.isRequired
  }

  getRedirectAction (): Action {
    const {param, cities} = this.props
    if (!cities) {
      throw new Error('Payload not available')
    }

    const i18n = this.context.i18n

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

export default connect(mapStateToProps, mapDispatchToProps)(I18nRedirectPage)
