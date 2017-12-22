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

import Hierarchy from '../Hierarchy'
import withAvailableLanguageUpdater from 'modules/language/hocs/withAvailableLanguageUpdater'
import PageModel from 'modules/endpoint/models/PageModel'
import { setAvailableLanguages } from 'modules/language/actions/setAvailableLanguages'

/**
 * Matching the route /<location>/<language>*
 */
class CategoriesPage extends React.Component {
  static propTypes = {
    location: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    path: PropTypes.string,
    pages: PropTypes.instanceOf(PageModel).isRequired
  }

  getParentPath () {
    return `/${this.props.location}/${this.props.language}`
  }

  componentDidMount () {
    this.setAvailableLanguages(this.props.path)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.path !== this.props.path) {
      this.setAvailableLanguages(nextProps.path)
    }
  }

  /**
   * Gets and stores the available languages for the current page
   * @param {string} path The current path
   */
  setAvailableLanguages (path) {
    const hierarchy = new Hierarchy(path)
    const error = hierarchy.build(this.props.pages)
    if (error) {
      // todo handle this error
      return
    }
    this.props.dispatch(setAvailableLanguages(hierarchy.top().availableLanguages))
  }

  componentWillUnmount () {
    this.props.dispatch(setAvailableLanguages({}))
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

const mapLanguageToUrl = (location, language, id) => (
  id ? `/${location}/${language}/redirect?id=${id}` : `/${location}/${language}`
)

const mapStateToWrapperProps = (state) => ({
  language: state.router.params.language,
  location: state.router.params.location,
  path: state.router.params['_'] // _ contains all the values from *
})

export default compose(
  withAvailableLanguageUpdater(mapLanguageToUrl),
  connect(mapStateToWrapperProps),
  withFetcher(PAGE_ENDPOINT)
)(CategoriesPage)
