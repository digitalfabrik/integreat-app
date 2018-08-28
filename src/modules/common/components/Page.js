// @flow

import React from 'react'
import Caption from 'modules/common/components/Caption'
import RemoteContent from 'modules/common/components/RemoteContent'

type PropsType = {
  title: string,
  content: string
}

class Page extends React.Component<PropsType> {
  render () {
    return (
      <div>
        <Caption title={this.props.title} />
        <RemoteContent dangerouslySetInnerHTML={{__html: this.props.content}} centered={false} />
      </div>
    )
  }
}

export default Page
