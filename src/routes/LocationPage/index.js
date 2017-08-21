import React from 'react'
import PropTypes from 'prop-types'

import Content from 'components/Content'
import Breadcrumb from 'components/Content/Breadcrumb'
import RichLayout from 'components/RichLayout'
import Error from 'components/Error'
import { PageFetcher } from 'endpoints'

import Hierarchy from './Hierarchy'

class PageAdapter extends React.Component {
  static propTypes = {
    location: PropTypes.string.isRequired,
    path: PropTypes.string
  }

  getParentPath () {
    return '/location/' + this.props.location
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
        location={this.props.location}
      />
      <Content url={url} hierarchy={hierarchy}/></div>
  }
}

class LocationPage extends React.Component {
  getLocation () {
    return this.props.match.params.location
  }

  render () {
    return (
      <RichLayout location={this.getLocation()}>
        <PageFetcher options={{location: this.getLocation()}}>
          <PageAdapter location={this.getLocation()} path={this.props.match.params.path}/>
        </PageFetcher>
      </RichLayout>
    )
  }
}

export default LocationPage
