// @flow

import React from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { StateType } from '../../app/StateType'
import ReactTooltip from 'react-tooltip'
import { StyledToolbarItem, SmallViewTip } from './StyledToolbarItem'

type PropsType = {|
  href: string,
  icon: {},
  text: string,
  viewportSmall: boolean
|}

const mapStateToProps = (state: StateType) => ({
  viewportSmall: state.viewport.is.small
})

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
        {viewportSmall && <SmallViewTip>{text}</SmallViewTip>}
      </StyledToolbarItem>
    )
  }
}

export default connect<*, *, *, *, *, *>(mapStateToProps)(ToolbarItem)
