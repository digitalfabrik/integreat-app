import React from 'react'
import PropTypes from 'prop-types'
import Hierarchy from './Hierarchy'
import { connect } from 'react-redux'

import Content from 'components/Content'
import Breadcrumb from 'components/Content/Breadcrumb'
import RichLayout from 'components/RichLayout'
import Error from 'components/Error'
import { PageFetcher } from 'endpoints'
import PageModel from 'endpoints/models/PageModel'
import PDFButton from '../../components/Content/PDFButton'

class PageAdapter extends React.Component {
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
    let url = this.getParentPath()
    let hierarchy = new Hierarchy(this.props.path)

    // Pass data to hierarchy
    let error = hierarchy.build(this.props.pages)
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
      <PDFButton languageCode={this.props.language} locationCode={this.props.location} page={hierarchy.top()} />
    </div>
  }
}

class LocationPage extends React.Component {
  static propTypes = {
    location: PropTypes.string.isRequired,
    path: PropTypes.string,
    language: PropTypes.string.isRequired
  }

  render () {
    return (
      <RichLayout location={this.props.location}>
        <PageFetcher>
          <PageAdapter
            location={this.props.location}
            language={this.props.language}
            path={this.props.path} />
        </PageFetcher>
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

export default connect(mapStateToProps)(LocationPage)
