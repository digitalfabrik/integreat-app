// @flow

import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ReactTooltip from 'react-tooltip'
import StyledToolbarItem from './StyledToolbarItem'

type PropsType = {|
  href: string,
  icon: {},
  text: string
|}

class ToolbarItem extends React.PureComponent<PropsType> {
  componentDidMount () {
    /* https://www.npmjs.com/package/react-tooltip#1-using-tooltip-within-the-modal-eg-react-modal- */
    ReactTooltip.rebuild()
  }

  render () {
    const { href, text, icon } = this.props
    return (
      <StyledToolbarItem href={href} aria-label={text}>
        <FontAwesomeIcon icon={icon} data-tip={text} />
      </StyledToolbarItem>
    )
  }
}

export default ToolbarItem
