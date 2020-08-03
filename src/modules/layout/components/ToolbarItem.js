// @flow

import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ReactTooltip from 'react-tooltip'
import StyledToolbarItem from './StyledToolbarItem'
import StyledSmallViewTip from './StyledSmallViewTip'

type PropsType = {|
  href: string,
  icon: {},
  text: string,
  viewportSmall: boolean
|}

class ToolbarItem extends React.PureComponent<PropsType> {
  componentDidMount () {
    /* https://www.npmjs.com/package/react-tooltip#1-using-tooltip-within-the-modal-eg-react-modal- */
    ReactTooltip.rebuild()
  }

  render () {
    const { href, text, icon, viewportSmall } = this.props
    return (
      <StyledToolbarItem href={href} ariaLabel={text}>
        <FontAwesomeIcon icon={icon} data-tip={text} data-event='mouseover' data-event-off='click mouseout' />
        {viewportSmall && <StyledSmallViewTip>{text}</StyledSmallViewTip>}
      </StyledToolbarItem>
    )
  }
}

export default ToolbarItem
