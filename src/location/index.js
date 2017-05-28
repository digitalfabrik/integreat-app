import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Layout from '../../components/Layout'
import Content from '../../components/Content/Content'

import fetchEndpoint from '../endpoint'
import { LANGUAGE_ENDPOINT, PAGE_ENDPOINT, PageModel } from '../endpoints'

class LocationPage extends React.Component {
  static propTypes = {
    languages: PropTypes.array.isRequired,
    page: PropTypes.instanceOf(PageModel).isRequired,
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

  page () {
    let currentPage = this.props.page

    // fixme if empty page
    if (currentPage.title === '') {
      return currentPage
    }

    this.props.path.forEach(id => {
      currentPage = currentPage.children[id]

      if (!currentPage) {
        throw new Error('Page not found!')
      }
    })

    return currentPage
  }

  render () {
    let url = this.props.match.url
    if (url.endsWith('/')) {
      url = url.substr(0, url.length - 1)
    }
    return (
      <Layout languageTo='/'>
        <Content title={'Augsburg'} url={ url } root={!this.props.match.params.path} page={this.page()}/>
      </Layout>
    )
  }
}
export default connect(state => {
  let languages = state.languages.data
  let pages = state.pages.data
  return ({
    languages: languages || [],
    page: pages || new PageModel()
  })
})(LocationPage)
