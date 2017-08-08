import React from 'react'
import PropTypes from 'prop-types'

import Content from 'components/Content'
import Breadcrumb from 'components/Content/Breadcrumb'
import HeaderLayout from 'components/HeaderLayout'
import { PageFetcher } from 'components/Fetcher'

import style from './style.css'
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
    hierarchy.build(this.props.pages)
    if (this.props.pagesPayload.error) {
      hierarchy.error(this.props.pagesPayload.error)
    }

    return <div>
      <Breadcrumb
        className={style.breadcrumbSpacing}
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
      <HeaderLayout location={this.getLocation()}>
        <PageFetcher location={this.getLocation()}>
          <PageAdapter location={this.getLocation()} path={this.props.match.params.path}/>
        </PageFetcher>
      </HeaderLayout>
    )
  }
}

export default LocationPage
