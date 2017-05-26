import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from 'react-spinkit'

import Layout from '../../components/Layout'

import fetchEndpoint from '../endpoint'
import { LANGUAGE_ENDPOINT, PAGE_ENDPOINT } from '../endpoints'

import style from './styles.css'
import { values } from 'lodash/object'
import { isEmpty } from 'lodash/lang'

class LocationPage extends React.Component {
  static propTypes = {
    languages: PropTypes.array.isRequired,
    pages: PropTypes.object.isRequired,
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

  toHtml (page) {
    return {__html: page}
  }

  render () {
    return (
      <Layout languageTo='/' className={style.content}>
        {/* We can insert our html here directly since we trust our backend cms */}
        {
          isEmpty(this.props.pages) ? <Spinner className={style.loading} name='line-scale-party'/> : values(this.props.pages).map((value) => <div
            key={value.id} className={style.remoteContent} dangerouslySetInnerHTML={this.toHtml(value.content)}/>)
        }
      </Layout>
    )
  }
}
export default connect(state => ({languages: state.languages.data, pages: state.pages.data}))(LocationPage)
