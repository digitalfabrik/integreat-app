import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Content from 'components/Content'
import PageLayout from 'components/PageLayout'
import Breadcrumb from 'components/Content/Breadcrumb'

import style from './style.css'
import Hierarchy from './Hierarchy'

class LocationPage extends React.Component {
  static propTypes = {
    hierarchy: PropTypes.instanceOf(Hierarchy)
  }

  componentDidUpdate () {
// eslint-disable-next-line
    window.scrollTo(0, 0)
  }

  getParentPath () {
    return '/location/' + this.getLocation()
  }

  getLocation () {
    return this.props.match.params.location
  }

  render () {
    return (
      <PageLayout location={this.getLocation()}>

        {this.props.hierarchy &&
        <div>
          <Breadcrumb
            className={style.breadcrumbSpacing}
            hierarchy={ this.props.hierarchy }
            location={ this.getLocation() }
          />
          <Content url={ this.getParentPath() }
                   hierarchy={ this.props.hierarchy }
          />
        </div>
        }
      </PageLayout>
    )
  }
}
/**
 * @param state The current app state
 * @param ownProps
 * @returns {{}}
 */
function mapStateToProps (state, ownProps) {
  let path = ownProps.match.params.path
  let hierarchy = new Hierarchy(path)
  let payload = state.pages

  if (!payload.data) {
    return {}
  }

  // Pass data to hierarchy
  hierarchy.build(payload.data)
  if (payload.error) {
    hierarchy.error(payload.error)
  }
  return {
    hierarchy: hierarchy
  }
}

export default connect(mapStateToProps)(LocationPage)
