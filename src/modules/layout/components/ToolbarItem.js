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
  componentDidMount () {
    /* https://www.npmjs.com/package/react-tooltip#1-using-tooltip-within-the-modal-eg-react-modal- */
    ReactTooltip.rebuild()
  }

  render () {
    return <div>
      <a className={style.item} href={this.props.href} target='_blank' data-tip={this.props.text}>
        <FontAwesome name={this.props.name} />
      </a>
    </div>
  }
}

export default ToolbarItem
