import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import Content from 'routes/categories/containers/Content'
import Breadcrumb from 'routes/categories/containers/Breadcrumb'
import Error from 'modules/common/containers/Error'
import PdfButton from 'routes/categories/components/PdfButton'
import withFetcher from 'modules/endpoint/hocs/withFetcher'
import PAGE_ENDPOINT from 'modules/endpoint/endpoints/pages'
import LANGUAGES_ENDPOINT from 'modules/endpoint/endpoints/languages'

import Hierarchy from '../Hierarchy'
import PageModel from 'modules/endpoint/models/PageModel'
import { setLanguageChangeUrls } from 'modules/language/actions/setLanguageChangeUrls'
import LanguageModel from 'modules/endpoint/models/LanguageModel'

/**
 * Matching the route /<location>/<language>*
 */
class CategoriesPage extends React.Component {
  static propTypes = {
    location: PropTypes.string.isRequired,
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)).isRequired,
    language: PropTypes.string.isRequired,
    path: PropTypes.string,
    pages: PropTypes.instanceOf(PageModel).isRequired
  }

  getParentPath () {
    return `/${this.props.location}/${this.props.language}`
  }

  componentDidMount () {
    this.setLanguageChangeUrls(this.props.path)
  }

  // we must not call dispatch in componentWillUpdate or componentDidUpdate
  componentWillReceiveProps (nextProps) {
    if (nextProps.path !== this.props.path) {
      this.setLanguageChangeUrls(nextProps.path)
    }
  }

  mapLanguageToUrl = (language, id) => (
    id ? `/${this.props.location}/${language}/redirect?id=${id}` : `/${this.props.location}/${language}`
  )

  /**
   * Gets and stores the available languages for the current page
   * @param {string} path The current path
   */
  setLanguageChangeUrls (path) {
    const hierarchy = new Hierarchy(path)
    const error = hierarchy.build(this.props.pages)
    if (error) {
      // todo handle this error
      return
    }
    this.props.dispatch(setLanguageChangeUrls(
      this.mapLanguageToUrl, this.props.languages, hierarchy.top().availableLanguages)
    )
  }

  getPdfFetchPath () {
    let path = `/${this.props.location}/${this.props.language}/fetch-pdf/`
    if (this.props.path) {
      path += this.props.path
    }
    return path
  }

  render () {
    const url = this.getParentPath()
    const hierarchy = new Hierarchy(this.props.path)

    // Pass data to hierarchy
    const error = hierarchy.build(this.props.pages)
    if (error) {
      return <Error error={error}/>
    }

    return <div>
      <Breadcrumb
        hierarchy={hierarchy}
        language={this.props.language}
        location={this.props.location}
      />
      <Content url={url} hierarchy={hierarchy}/>
      <PdfButton href={this.getPdfFetchPath()}/>
    </div>
  }
}

const mapStateToProps = (state) => ({
  language: state.router.params.language,
  location: state.router.params.location,
  path: state.router.params['_'] // _ contains all the values from *
})

export default compose(
  connect(mapStateToProps),
  withFetcher(PAGE_ENDPOINT),
  withFetcher(LANGUAGES_ENDPOINT)
)(CategoriesPage)
