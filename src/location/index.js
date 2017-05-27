import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Layout from '../../components/Layout'
import Page from '../../components/Page/Page'

import fetchEndpoint from '../endpoint'
import { LANGUAGE_ENDPOINT, PAGE_ENDPOINT } from '../endpoints'

import style from './styles.css'

class LocationPage extends React.Component {
  static propTypes = {
    languages: PropTypes.array.isRequired,
    pages: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  componentWillUnmount () {
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
      <Layout languageTo='/' className={style.content}>
        <Page title={'Augsburg'} pages={this.props.pages}/>
      </Layout>
    )
  }
}
export default connect(state => ({languages: state.languages.data, pages: state.pages.data}))(LocationPage)
