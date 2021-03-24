// @flow

import * as React from 'react'
import EastereggImage from './EastereggImage'
import styled from 'styled-components/native'
import { type StyledComponent } from 'styled-components'
import type { ThemeType } from '../../../modules/theme/constants'

type PropsType = {|
  clearResourcesAndCache: () => void,
  theme: ThemeType
|}

const Wrapper: StyledComponent<{| children: React.Node |}, {}, *> = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
`

class Heading extends React.Component<PropsType> {
  render() {
    const { clearResourcesAndCache, theme } = this.props
    return (
      <Wrapper>
        <EastereggImage clearResourcesAndCache={clearResourcesAndCache} theme={theme} />
      </Wrapper>
    )
  }
}

export default Heading
