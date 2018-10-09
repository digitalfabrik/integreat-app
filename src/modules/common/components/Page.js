// @flow

import React from 'react'
import Caption from './Caption'
import RemoteContent from './RemoteContent'

type PropsType = {|
  title: string,
  content: string,
  onInternLinkClick: string => void,
  hijackRegExp?: RegExp
|}

class Page extends React.Component<PropsType> {
  render () {
    return (
      <div>
        <Caption title={this.props.title} />
        <RemoteContent dangerouslySetInnerHTML={{__html: this.props.content}} centered={false}
                       onInternLinkClick={this.props.onInternLinkClick} hijackRegExp={this.props.hijackRegExp} />
      </div>
    )
  }
}

export default Page
