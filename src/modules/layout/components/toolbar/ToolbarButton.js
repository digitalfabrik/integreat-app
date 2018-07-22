// @flow

import React from 'react'
import FontAwesome from 'react-fontawesome'
import ReactTooltip from 'react-tooltip'

import style from './ToolbarItem.css'

type PropsType = {
  onClick: () => void,
  name: string,
  text: string
}

class ToolbarButton extends React.PureComponent<PropsType> {
  componentDidMount () {
    /* https://www.npmjs.com/package/react-tooltip#1-using-tooltip-within-the-modal-eg-react-modal- */
    ReactTooltip.rebuild()
  }

  render () {
    const {text, name, onClick} = this.props
    return <FontAwesome className={style.item} data-tip={text} name={name} onClick={onClick} />
  }
}

export default ToolbarButton
