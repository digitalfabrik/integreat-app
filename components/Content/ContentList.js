import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { values } from 'lodash/object'

import style from './ContentList.pcss'
import { PageModel } from '../../src/endpoints'

class ContentList extends React.Component {
  static propTypes = {
    page: PropTypes.instanceOf(PageModel).isRequired
  }

  render () {
    return (
      <div>
        {
          values(this.props.page.children).map(page => {
            return <div key={page.id}>
              {page.title}
            </div>
          })
        }
      </div>
    )
  }
}

export default ContentList
