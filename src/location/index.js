import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { isEmpty } from 'lodash/lang'

import Layout from '../../components/Layout'
import Content from '../../components/Content/Content'

import { fetchEndpoint } from '../endpoints/endpoint'
import PAGE_ENDPOINT, { PageModel } from '../endpoints/page'

import LANGUAGE_ENDPOINT, { LanguageModel } from '../endpoints/language'

import NAVIGATION from '../navigation'
import { last } from 'lodash/array'
import Breadcrumb from '../../components/Content/Breadcrumb'

import { history } from '../main'

import style from './styles.css'

class LocationPage extends React.Component {
  static propTypes = {
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)).isRequired,
    page: PropTypes.instanceOf(PageModel).isRequired,
    path: PropTypes.arrayOf(PropTypes.string),
    dispatch: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)

    this.reload = this.reload.bind(this)
  }

  componentDidUpdate () {
// eslint-disable-next-line indent
    window.scrollTo(0, 0)
  }

  componentWillUnmount () {
    // todo only do this if necessary
    this.props.dispatch(LANGUAGE_ENDPOINT.invalidateAction())
  }

  componentWillMount () {
    this.fetchData('en')
  }

  fetchData (languageCode) {
    // todo make location and language dynamic
    this.props.dispatch(fetchEndpoint(LANGUAGE_ENDPOINT, url => url.replace('{location}', 'augsburg').replace('{language}', languageCode)))
    this.props.dispatch(fetchEndpoint(PAGE_ENDPOINT, url => url
      .replace('{location}', this.props.match.params.location)
      .replace('{language}', languageCode)
      .replace('{since}', new Date(0).toISOString().split('.')[0] + 'Z')))
  }

  reload (code) {
    history.push('/location/augsburg')
    this.props.dispatch(PAGE_ENDPOINT.invalidateAction())
    this.fetchData(code)
  }

  /**
   * Finds the current page which should be rendered based on {@link this.path}
   * @return {*} The model to renders
   */
  hierarchy () {
    let currentPage = this.props.page
    let hierarchy = [currentPage]

    // fixme if empty page: no data
    if (currentPage.title === '') {
      return hierarchy
    }

    this.props.path.forEach(id => {
      currentPage = currentPage.children[id]

      if (!currentPage) {
        throw new Error('Page not found!')
      }

      hierarchy.push(currentPage)
    })

    return hierarchy
  }

  static normalizeURL (url) {
    if (url.endsWith('/')) {
      return url.substr(0, url.length - 1)
    }

    return url
  }

  render () {
    let url = LocationPage.normalizeURL(this.props.match.url)
    let isRoot = isEmpty(this.props.path)
    let hierarchy = this.hierarchy()

    return (
      <Layout
        languageCallback={this.reload}
        languages={this.props.languages} navigation={NAVIGATION}>

        { /* Breadcrumb */ }
        <Breadcrumb className={style.breadcrumbSpacing}
                    hierarchy={hierarchy}
        />

        { /* Content */ }
        <Content title={'Augsburg'} url={ url } root={ isRoot } page={last(hierarchy)}/>
      </Layout>
    )
  }
}

/**
 * @param state The current app state
 * @return {{languages: Array, page: PageModel}} The endpoint values from the state mapped to props
 */
function mapeStateToProps (state) {
  let languages = state.languages.data
  let pages = state.pages.data
  return ({
    languages: languages || [],
    page: pages || new PageModel()
  })
}

export default connect(mapeStateToProps)(LocationPage)
