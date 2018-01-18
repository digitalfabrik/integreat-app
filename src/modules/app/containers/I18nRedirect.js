import React from 'react'
import PropTypes from 'prop-types'
import { replace } from 'redux-little-router'
import normalizeUrl from 'normalize-url'

import { connect } from 'react-redux'

class I18nRedirect extends React.Component {
  static propTypes = {
    redirect: PropTypes.func.isRequired,
    currentPath: PropTypes.string.isRequired
  }

  static contextTypes = {
    i18n: PropTypes.object
  }

  componentWillMount () {
    this.props.redirect(normalizeUrl(this.props.currentPath) + '/' + this.context.i18n.language)
  }

  render () {
    return null
  }
}

const mapDispatchToProps = (dispatch) => ({
  redirect: href => dispatch(replace(href))
})

const mapStateToProps = (state) => ({
  currentPath: state.router.pathname
})

export default connect(mapStateToProps, mapDispatchToProps)(I18nRedirect)
