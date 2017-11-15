import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import Content from 'components/Content'
import Breadcrumb from 'components/Content/Breadcrumb'
import RichLayout from 'components/RichLayout'
import Error from 'components/Error'
import PdfButton from 'components/Content/PdfButton'
import withFetcher from 'endpoints/withFetcher'
import PAGE_ENDPOINT from 'endpoints/page'

import Hierarchy from './Hierarchy'
import PdfFetcher from 'components/PdfFetcher'
import { setLanguageChangeUrls } from 'actions'
import {reduce} from 'lodash/collection'
import PageModel from 'endpoints/models/PageModel'

class ContentWrapper extends React.Component {
  static propTypes = {
    location: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    isPdfDownload: PropTypes.bool.isRequired,
    path: PropTypes.string,
    pages: PropTypes.instanceOf(PageModel).isRequired
  }

  getParentPath () {
    return `/${this.props.location}/${this.props.language}`
  }

  componentDidMount () {
    this.updateLanguageChangeUrls(this.props.path)
  }

  componentWillUpdate (nextProps) {
    if (nextProps.path !== this.props.path) {
      this.updateLanguageChangeUrls(nextProps.path)
    }
  }

  /**
   * Creates and stores the urls that are used to redirect on a language change
   * @param {string} path The current path
   */
  updateLanguageChangeUrls (path) {
    const hierarchy = new Hierarchy(path)

    // Pass data to hierarchy
    const error = hierarchy.build(this.props.pages)
    if (error) {
      return
    }

    const currentPage = hierarchy.top()
    const redirect = (id, language) => `/${this.props.location}/${language}/redirect?id=${id}`
    const languageChangeUrls = reduce(currentPage.availableLanguages, (acc, id, language) => {
      acc[language] = redirect(id, language)
      return acc
    }, {})
    this.props.dispatch(setLanguageChangeUrls(languageChangeUrls))
  }

  componentWillUnmount () {
    this.props.dispatch(setLanguageChangeUrls({}))
  }

  render () {
    const url = this.getParentPath()
    const hierarchy = new Hierarchy(this.props.path)

    // Pass data to hierarchy
    const error = hierarchy.build(this.props.pages)
    if (error) {
      return <Error error={error}/>
    }

    if (this.props.isPdfDownload) {
      return <PdfFetcher page={hierarchy.top()}/>
    }

    return <div>
      <Breadcrumb
        hierarchy={hierarchy}
        language={this.props.language}
        location={this.props.location}
      />
      <Content url={url} hierarchy={hierarchy}/>
      <PdfButton/>
    </div>
  }
}

const mapStateToWrapperProps = (state) => ({
  language: state.router.params.language,
  location: state.router.params.location,
  path: state.router.params['_'] // _ contains all the values from *
})

const FetchingContentWrapper = compose(
  connect(mapStateToWrapperProps),
  withFetcher(PAGE_ENDPOINT)
)(ContentWrapper)

class LocationPage extends React.Component {
  static propTypes = {
    isPdfDownload: PropTypes.bool.isRequired
  }

  render () {
    if (this.props.isPdfDownload) {
      return <FetchingContentWrapper isPdfDownload={true}/>
    } else {
      return <RichLayout>
        <FetchingContentWrapper isPdfDownload={false}/>
      </RichLayout>
    }
  }
}

const mapStateToProps = (state) => ({isPdfDownload: state.router.query.pdf !== undefined})

export default connect(mapStateToProps)(LocationPage)
