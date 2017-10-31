import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import PdfButton from '../../components/Content/PdfButton'
import PdfFetcher from '../../components/PdfFetcher'
import Content from '../../components/Content'
import RichLayout from '../../components/RichLayout'
import Breadcrumb from '../../components/Content/Breadcrumb'
import Error from '../../components/Error'
import PageModel from '../../endpoints/models/PageModel'
import PAGE_ENDPOINT from '../../endpoints/page'
import withFetcher from '../../endpoints/withFetcher'
import Hierarchy from './Hierarchy'

class ContentWrapper extends React.Component {
  static propTypes = {
    hierarchy: PropTypes.instanceOf(Hierarchy).isRequired,
    location: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    isPdfDownload: PropTypes.bool.isRequired
  }

  getParentPath () {
    return `/${this.props.location}/${this.props.language}`
  }

  render () {
    const url = this.getParentPath()

    if (this.props.isPdfDownload) {
      return <PdfFetcher page={this.props.hierarchy.top()} />
    }

    return <div>
      <Breadcrumb
        hierarchy={this.props.hierarchy}
        language={this.props.language}
        location={this.props.location}
      />
      <Content url={url} hierarchy={this.props.hierarchy}/>
      <PdfButton />
    </div>
  }
}

class LocationPage extends React.Component {
  static propTypes = {
    location: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    path: PropTypes.string,
    pages: PropTypes.instanceOf(PageModel).isRequired,
    isPdfDownload: PropTypes.bool.isRequired
  }

  render () {
    const hierarchy = new Hierarchy(this.props.path)

    // Pass data to hierarchy
    const error = hierarchy.build(this.props.pages)
    if (error) {
      return <Error error={error}/>
    }

    if (this.props.isPdfDownload) {
      return (
        <ContentWrapper hierarchy={hierarchy} location={this.props.location}
                        language={this.props.language} isPdfDownload={true}/>
      )
    } else {
      return (
        <RichLayout hierarchy={hierarchy}>
          <ContentWrapper hierarchy={hierarchy} location={this.props.location}
                          language={this.props.language} isPdfDownload={false}/>
        </RichLayout>
      )
    }
  }
}
const mapStateToProps = (state) => ({
  language: state.router.params.language,
  location: state.router.params.location,
  path: state.router.params['_'], // _ contains all the values from *
  isPdfDownload: state.router.query.pdf !== undefined
})

export default compose(
  connect(mapStateToProps),
  withFetcher(PAGE_ENDPOINT)
)(LocationPage)
