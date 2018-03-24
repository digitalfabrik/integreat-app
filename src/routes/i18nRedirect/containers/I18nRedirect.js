// @flow

import React from 'react'
import PropTypes from 'prop-types'
import { redirect } from 'redux-first-router'
import { connect } from 'react-redux'
import CityModel from '../../../modules/endpoint/models/CityModel'
import { goToLanding } from '../../../modules/app/routes/landing'
import { goToCategories } from '../../../modules/app/routes/categories'
import { MAX_LANGUAGE_CODE_LENGTH, MIN_LANGUAGE_CODE_LENGTH } from '../../../modules/app/constants'
import { goToNotFound } from '../../../modules/app/routes/notFound'

import type { Action } from 'redux-first-router/dist/flow-types'
import { goToMainDisclaimer } from '../../../modules/app/routes/mainDisclaimer'

type Props = {
  redirect: (Action) => void,
  cities: Array<CityModel>,
  param: ?string
}

/**
 * Adds the language code at the end of the current path
 */
export class I18nRedirect extends React.Component<Props> {
  static contextTypes = {
    // we have to do this with PropTypes, because context is not known at compile time. A possible solution would be:
    // https://github.com/codemix/flow-runtime
    i18n: PropTypes.object.isRequired
  }

  getRedirectAction (): Action {
    const {param, cities} = this.props
    const i18n = this.context.i18n

    // the param does not exist (or is 'landing'), so redirect to the landing page with the detected language
    if (!param || param === 'landing') {
      return goToLanding(i18n.language)
    }

    if (param === 'disclaimer') {
      return goToMainDisclaimer()
    }

    if (param === 'not_found') {
      return goToNotFound()
    }

    // the param is a valid city, so redirect to the categories route with the detected language
    if (cities.find(_city => _city.code === param)) {
      return goToCategories(param, i18n.language)
    }

    // the param is probably a language code, so redirect to the landing route
    if (param.length >= MIN_LANGUAGE_CODE_LENGTH && param.length <= MAX_LANGUAGE_CODE_LENGTH) {
      return goToLanding(param)
    }

    // param is neither a language code nor a city, so it is not a valid route
    return goToNotFound()
  }

  componentDidMount () {
    this.props.redirect(this.getRedirectAction())
  }

  render () {
    return null
  }
}

const mapDispatchToProps = dispatch => ({
  redirect: action => dispatch(redirect(action))
})

const mapStateToProps = state => ({
  cities: state.cities.data,
  param: state.location.payload.param
})

export default connect(mapStateToProps, mapDispatchToProps)(I18nRedirect)
