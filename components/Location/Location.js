import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { transform } from 'lodash/object'
import { isEmpty } from 'lodash/lang'
import { Link } from 'react-router-dom'

import content from './Location.pcss'

class LocationParentEntry extends React.Component {
  static propTypes = {
    name: PropTypes.string
  }

  render () {
    return (
      <div className={content.languageListParent}>{this.props.name}</div>
    )
  }
}

class LocationEntry extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    to: PropTypes.string
  }

  render () {
    return (
      <Link to={{pathname: this.props.to}} className={content.languageListItem}>
        <div>{this.props.name}</div>
      </Link>
    )
  }
}

class Location extends React.Component {
  static propTypes = {
    locations: PropTypes.object,
    filterText: PropTypes.string
  }

  render () {
    let that = this
    return (
      <div className={cx(content.languageList, 'row')}>
        {
          transform(this.props.locations, (result, locations, key) => {
            locations = locations.filter((location) => location.name.toLowerCase().includes(that.props.filterText.toLowerCase()))
            if (isEmpty(locations)) {
              return
            }

            result.push(<LocationParentEntry key={key} name={key}/>)

            locations.forEach((location, index) => result.push(<LocationEntry name={location.name}
                                                                              to={'/location' + location.path}
                                                                              key={key + index}/>))
          }, [])
        }
      </div>
    )
  }
}

export default Location
