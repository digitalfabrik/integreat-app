import React from 'react'
import PropTypes from 'prop-types'

import { values } from 'lodash/object'

import { PageModel } from '../../src/endpoints/page'
import { Link } from 'react-router-dom'

class ContentList extends React.Component {
  static propTypes = {
    page: PropTypes.instanceOf(PageModel).isRequired,
    url: PropTypes.string
  }

  render () {
    return (
      <div>
        {
          values(this.props.page.children).map(page => {
            return <Link key={page.id} to={this.props.url + (this.props.url.length === 0 ? '' : '/') + page.id}>
              {page.title}
            </Link>
          })
        }
      </div>
    )
  }
}

export default ContentList
