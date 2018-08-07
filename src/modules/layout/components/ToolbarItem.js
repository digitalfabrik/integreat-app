// @flow

import React from 'react'
import FontAwesome from 'react-fontawesome'
import ReactTooltip from 'react-tooltip'

import styled from 'styled-components'
import CleanAnchor from '../../common/components/CleanAnchor'

export const StyledToolbarItem = styled(CleanAnchor)`
  display: inline-block;
  margin: 0 10px;
  padding: 8px;
`

type PropsType = {
  href: string,
  name: string,
  text: string
}

class ToolbarItem extends React.PureComponent<PropsType> {
  componentDidMount () {
    /* https://www.npmjs.com/package/react-tooltip#1-using-tooltip-within-the-modal-eg-react-modal- */
    ReactTooltip.rebuild()
  }

  render () {
    const {href, text, name} = this.props
    return (
      <StyledToolbarItem href={href} target='_blank' data-tip={text}>
        <FontAwesome name={name} />
      </StyledToolbarItem>
    )
  }
}

export default ToolbarItem
