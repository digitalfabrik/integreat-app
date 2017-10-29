import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import Content from 'components/Content'
import Breadcrumb from 'components/Content/Breadcrumb'
import RichLayout from 'components/RichLayout'
import Error from 'components/Error'
import PageModel from 'endpoints/models/PageModel'
import PDFButton from 'components/Content/PDFButton'
import withFetcher from 'endpoints/withFetcher'
import PAGE_ENDPOINT from 'endpoints/page'

import Hierarchy from './Hierarchy'
import PdfFetcher from 'components/PdfFetcher'

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

  render () {
    const url = this.getParentPath()
    const hierarchy = new Hierarchy(this.props.path)

    // Pass data to hierarchy
    const error = hierarchy.build(this.props.pages)
    if (error) {
      return <Error error={error}/>
    }

    if (this.props.isPdfDownload) {
      return <PdfFetcher page={hierarchy.top()} />
    }

    return <div>
      <Breadcrumb
        hierarchy={hierarchy}
        language={this.props.language}
        location={this.props.location}
      />
      <Content url={url} hierarchy={hierarchy}/>
      <PDFButton />
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

const mapStateToProps = (state) => ({ isPdfDownload: !!state.router.query.pdf })

export default connect(mapStateToProps)(LocationPage)
