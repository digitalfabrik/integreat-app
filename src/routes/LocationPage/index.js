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

class ContentWrapper extends React.Component {
  static propTypes = {
    location: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
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

    return <div>
      <Breadcrumb
        hierarchy={hierarchy}
        language={this.props.language}
        location={this.props.location}
      />
      <Content url={url} hierarchy={hierarchy}/>
      <PDFButton languageCode={this.props.language}
                 locationCode={this.props.location}
                 page={hierarchy.top()}/>
    </div>
  }
}

function mapStateToProps (state) {
  return {
    language: state.router.params.language,
    location: state.router.params.location,
    path: state.router.params['_'] // _ contains all the values from *
  }
}

const FetchingContentWrapper = compose(
  connect(mapStateToProps),
  withFetcher(PAGE_ENDPOINT)
)(ContentWrapper)

class LocationPage extends React.Component {
  render () {
    return (
      <RichLayout>
        <FetchingContentWrapper/>
      </RichLayout>
    )
  }
}

export default LocationPage
