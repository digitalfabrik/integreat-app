import React from 'react'
import PropTypes from 'prop-types'

import Content from 'components/Content'
import Breadcrumb from 'components/Content/Breadcrumb'
import HeaderLayout from 'components/HeaderLayout'
import PageFetcher from 'components/Fetcher/PageFetcher'

import style from './style.css'
import Hierarchy from './Hierarchy'

class PageAdapter extends React.Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    path: PropTypes.string,
    location: PropTypes.string.isRequired
  }

  render () {
    let hierarchy = new Hierarchy(this.props.path)

    // Pass data to hierarchy
    hierarchy.build(this.props.page)
    if (this.props.pagePayload.error) {
      hierarchy.error(this.props.pagePayload.error)
    }

    return <div>
      <Breadcrumb
        className={style.breadcrumbSpacing}
        hierarchy={hierarchy}
        location={this.props.location}
      />
      <Content url={this.props.url} hierarchy={hierarchy}/></div>
  }
}

class LocationPage extends React.Component {
  getParentPath () {
    return '/location/' + this.getLocation()
  }

  getLocation () {
    return this.props.match.params.location
  }

  render () {
    return (
      <HeaderLayout location={this.getLocation()}>
        <PageFetcher location={this.getLocation()}>
          <PageAdapter location={this.getLocation()} url={this.getParentPath()} path={this.props.match.params.path}/>
        </PageFetcher>
      </HeaderLayout>
    )
  }
}

export default LocationPage
