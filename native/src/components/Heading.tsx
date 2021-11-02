import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { ThemeType } from 'build-configs'

import EastereggImage from './EastereggImage'

type PropsType = {
  clearResourcesAndCache: () => void
  theme: ThemeType
}
const Wrapper = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Heading = ({ clearResourcesAndCache, theme }: PropsType): ReactElement => (
  <Wrapper>
    <EastereggImage clearResourcesAndCache={clearResourcesAndCache} theme={theme} />
  </Wrapper>
)

export default Heading
