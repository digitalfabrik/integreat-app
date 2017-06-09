import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Layout from 'components/Layout/Layout'
import Content from 'components/Content/Content'

import { fetchEndpoint } from 'endpoints/endpoint'
import PAGE_ENDPOINT, { EMPTY_PAGE, PageModel } from 'endpoints/page'

import LANGUAGE_ENDPOINT, { LanguageModel } from 'endpoints/language'

import NAVIGATION from 'navigation'
import Breadcrumb from 'components/Content/Breadcrumb'

import { history } from 'main'

import style from './styles.css'
import Hierarchy from './hierarchy'

class LocationPage extends React.Component {
  static propTypes = {
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)).isRequired,
    page: PropTypes.instanceOf(PageModel).isRequired,
    hierarchy: PropTypes.instanceOf(Hierarchy).isRequired,
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
    this.props.dispatch(PAGE_ENDPOINT.invalidateAction())
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
      .replace('{since}', new Date(0).toISOString().split('.')[0] + 'Z'), {location: 'Augsburg'}))
  }

  reload (code) {
    // todo make dynamic
    history.push('/location/augsburg')
    this.props.dispatch(PAGE_ENDPOINT.invalidateAction())
    this.fetchData(code)
  }

  render () {
    let hierarchy = this.props.hierarchy
    hierarchy.build(this.props.page)

    return (
      <Layout
        languageCallback={this.reload}
        languages={this.props.languages} navigation={NAVIGATION}>

        { /* Breadcrumb */ }
        <Breadcrumb className={style.breadcrumbSpacing}
                    hierarchy={hierarchy}
        />

        { /* Content */ }
        <Content url={ this.props.match.url } root={ hierarchy.isRoot() } page={hierarchy.top()}/>
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
    page: pages || EMPTY_PAGE
  })
}

export default connect(mapeStateToProps)(LocationPage)
