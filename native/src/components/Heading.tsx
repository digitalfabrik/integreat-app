import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import LandingIcon from './LandingIcon'

type HeadingProps = {
  clearResourcesAndCache: () => void
}
const Wrapper = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Heading = ({ clearResourcesAndCache }: HeadingProps): ReactElement => (
  <Wrapper>
    <LandingIcon clearResourcesAndCache={clearResourcesAndCache} />
  </Wrapper>
)

export default Heading
