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
import { setLanguage } from '../actions'

const BIRTH_OF_UNIVERSE = new Date(0).toISOString().split('.')[0] + 'Z'

class LocationPage extends React.Component {
  static propTypes = {
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)).isRequired,
    page: PropTypes.instanceOf(PageModel).isRequired,
    language: PropTypes.string.isRequired,
    hierarchy: PropTypes.instanceOf(Hierarchy).isRequired,
    dispatch: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)

    this.changeLanguage = this.changeLanguage.bind(this)
  }

  componentDidUpdate () {
// eslint-disable-next-line
    window.scrollTo(0, 0)
  }

  componentWillUnmount () {
    // todo only do this if necessary
    this.props.dispatch(LANGUAGE_ENDPOINT.invalidateAction())
    this.props.dispatch(PAGE_ENDPOINT.invalidateAction())
  }

  componentWillMount () {
    this.fetchData(this.props.language)
  }

  fetchData (languageCode) {
    let location = this.props.match.params.location
    this.props.dispatch(fetchEndpoint(LANGUAGE_ENDPOINT, url => url
      .replace('{location}', location)
      .replace('{language}', languageCode)))
    this.props.dispatch(fetchEndpoint(PAGE_ENDPOINT, url => url
      .replace('{location}', location)
      .replace('{language}', languageCode)
      .replace('{since}', BIRTH_OF_UNIVERSE), {location: location}))
  }

  changeLanguage (code) {
    this.props.dispatch(setLanguage(code))
    // beautify
    history.push('/location/' + this.props.match.params.location)
    this.props.dispatch(PAGE_ENDPOINT.invalidateAction())
    this.fetchData(code)
  }

  render () {
    let hierarchy = this.props.hierarchy
    hierarchy.build(this.props.page)

    return (
      <Layout
        languageCallback={this.changeLanguage}
        languages={this.props.languages} navigation={NAVIGATION}>

        { /* Breadcrumb */ }
        <Breadcrumb className={style.breadcrumbSpacing} hierarchy={hierarchy}/>

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
    page: pages || EMPTY_PAGE,
    language: state.language.language
  })
}

export default connect(mapeStateToProps)(LocationPage)
