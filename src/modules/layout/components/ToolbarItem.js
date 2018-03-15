// @flow

import React from 'react'
import FontAwesome from 'react-fontawesome'
import ReactTooltip from 'react-tooltip'

import style from './ToolbarItem.css'

type Props = {
  href: string,
  name: string,
  text: string
}

class ToolbarItem extends React.PureComponent<Props> {
  render () {
    return <div>
      <a className={style.item} href={this.props.href} target='_blank'
         data-tip={this.props.text} data-delay-show={300}>
        <FontAwesome name={this.props.name} />
      </a>
      <ReactTooltip place='top' type='dark' effect='solid' />
    </div>
  }
}

export default ToolbarItem
