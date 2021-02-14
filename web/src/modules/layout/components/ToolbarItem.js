// @flow

import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import StyledToolbarItem from './StyledToolbarItem'
import StyledSmallViewTip from './StyledSmallViewTip'
import Tooltip from '../../common/components/Tooltip'

type PropsType = {|
  href: string,
  icon: {},
  text: string,
  viewportSmall: boolean
|}

class ToolbarItem extends React.PureComponent<PropsType> {
  render () {
    const { href, text, icon, viewportSmall } = this.props
    return (
      <Tooltip text={text} flow='up' mediumViewportFlow='right' smallViewportFlow='down'>
        <StyledToolbarItem href={href} ariaLabel={text}>
          <FontAwesomeIcon icon={icon} />
          {viewportSmall && <StyledSmallViewTip>{text}</StyledSmallViewTip>}
        </StyledToolbarItem>
      </Tooltip>
    )
  }
}

export default ToolbarItem
