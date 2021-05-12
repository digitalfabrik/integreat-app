// @flow

import React from 'react'
import styled, { type StyledComponent } from 'styled-components'
import type { ThemeType } from 'build-configs/ThemeType'

const Identifier: StyledComponent<{||}, ThemeType, *> = styled.span`
  font-weight: 700;
`

type PropsType = {|
  identifier: string,
  information: string
|}

class PageDetail extends React.PureComponent<PropsType> {
  render() {
    const { identifier, information } = this.props
    return (
      <div>
        <Identifier>{identifier}: </Identifier>
        <span>{information}</span>
      </div>
    )
  }
}

export default PageDetail
