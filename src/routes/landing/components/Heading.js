// @flow

import * as React from 'react'
import EastereggImage from './EastereggImage'
import styled, { type StyledComponent } from 'styled-components/native'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import type Moment from 'moment'

type StateType = {| clickCount: number, clickStart: ?Moment, apiUrlOverride: ?string |}

type PropsType = {|
  clearResourcesAndCache: () => void,
  theme: ThemeType
|}

const Wrapper: StyledComponent<{| children: React.Node |}, {}, *> = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
`

class Heading extends React.Component<PropsType, StateType> {
  render () {
    const { clearResourcesAndCache, theme } = this.props
    return (
      <Wrapper>
        <EastereggImage clearResourcesAndCache={clearResourcesAndCache} theme={theme} />
      </Wrapper>
    )
  }
}

export default Heading
