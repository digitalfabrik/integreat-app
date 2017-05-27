import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Layout from '../../components/Layout'
import Content from '../../components/Content/ContentContainer'

import fetchEndpoint from '../endpoint'
import { LANGUAGE_ENDPOINT, PAGE_ENDPOINT, PageModel } from '../endpoints'

class LocationPage extends React.Component {
  static propTypes = {
    languages: PropTypes.array.isRequired,
    pages: PropTypes.objectOf(PropTypes.instanceOf(PageModel)).isRequired,
    path: PropTypes.arrayOf(PropTypes.string),
    dispatch: PropTypes.func.isRequired
  }

  componentWillUnmount () {
    // todo only do this if necessary
    this.props.dispatch(LANGUAGE_ENDPOINT.invalidateAction())
    this.props.dispatch(PAGE_ENDPOINT.invalidateAction())
  }

  componentWillMount () {
    this.props.dispatch(fetchEndpoint(LANGUAGE_ENDPOINT, url => url.replace('{location}', 'augsburg').replace('{language}', 'en')))
    this.props.dispatch(fetchEndpoint(PAGE_ENDPOINT, url => url
      .replace('{location}', this.props.match.params.location)
      .replace('{language}', 'en')
      .replace('{since}', new Date(0).toISOString().split('.')[0] + 'Z')))
  }

  render () {
    return (
      <Layout languageTo='/'>
        <Content title={'Augsburg'} path={this.props.path} pages={this.props.pages}/>
      </Layout>
    )
  }
}
export default connect(state => {
  let languages = state.languages.data
  let pages = state.pages.data
  return ({
    languages: languages || [],
    pages: pages || {}
  })
})(LocationPage)
