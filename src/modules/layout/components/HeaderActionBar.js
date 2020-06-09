// @flow

import * as React from 'react'
import styled from 'styled-components'

const ActionItems = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

type PropsType = {|
  className?: string,
  children: Array<React.Node>
|}

/**
 * Designed to work with Header. In the ActionBar you can display icons as link or dropDown involving actions like
 * 'Change language', 'Change location' and similar items.
 */
class HeaderActionBar extends React.PureComponent<PropsType> {
  render () {
    const { children, className } = this.props
    return (
      <ActionItems className={className}>{children}</ActionItems>
    )
  }
}

export default HeaderActionBar
