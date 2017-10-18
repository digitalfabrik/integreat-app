import React from 'react'
import PropTypes from 'prop-types'
import Hierarchy from './Hierarchy'
import { connect } from 'react-redux'

import Content from 'components/Content'
import Breadcrumb from 'components/Content/Breadcrumb'
import RichLayout from 'components/RichLayout'
import Error from 'components/Error'
import PageModel from 'endpoints/models/PageModel'
import PDFButton from '../../components/Content/PDFButton'
import withFetcher from '../../endpoints/withFetcher'
import PAGE_ENDPOINT from 'endpoints/page'

class LocationPage extends React.Component {
  static propTypes = {
    location: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    path: PropTypes.string,
    pages: PropTypes.instanceOf(PageModel)
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

    return (
      <RichLayout location={this.props.location}>
        <div>
          <Breadcrumb
            hierarchy={hierarchy}
            language={this.props.language}
            location={this.props.location}
          />
          <Content url={url} hierarchy={hierarchy}/>
          <PDFButton languageCode={this.props.language} locationCode={this.props.location} page={hierarchy.top()}/>
        </div>
      </RichLayout>
    )
  }
}

function mapStateToProps (state) {
  return {
    location: state.router.params.location,
    language: state.router.params.language,
    path: state.router.params['_'] // _ contains all the values from *
  }
}

export default connect(mapStateToProps)(withFetcher(PAGE_ENDPOINT)(LocationPage))
