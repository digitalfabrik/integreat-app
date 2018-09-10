// @flow

import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ReactTooltip from 'react-tooltip'

import styled from 'styled-components'
import CleanAnchor from '../../common/components/CleanAnchor'

export const StyledToolbarItem = styled(CleanAnchor)`
  display: inline-block;
  margin: 0 10px;
  padding: 8px;
  cursor: pointer;
`

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
    const {href, text, icon} = this.props
    return (
      <StyledToolbarItem href={href} target='_blank' rel='noopener' data-tip={text}>
        <FontAwesomeIcon icon={icon} />
      </StyledToolbarItem>
    )
  }
}

export default ToolbarItem
