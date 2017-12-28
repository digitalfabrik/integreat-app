import React from 'react'
import PropTypes from 'prop-types'

import Caption from 'modules/common/components/Caption'
import RemoteContent from 'modules/common/components/RemoteContent'
import CategoryModel from '../../../modules/endpoint/models/CategoryModel'

class Page extends React.Component {
  static propTypes = {
    page: PropTypes.instanceOf(CategoryModel).isRequired
  }

  render () {
    return (
      <div>
        <Caption title={this.props.page.title} />
        <RemoteContent dangerouslySetInnerHTML={{__html: this.props.page.content}} />
      </div>
    )
  }
}

export default Page
