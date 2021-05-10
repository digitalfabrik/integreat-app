import * as React from 'react'
import EastereggImage from './EastereggImage'
import styled from 'styled-components/native'
import { ThemeType } from 'build-configs/ThemeType'

type PropsType = {
  clearResourcesAndCache: () => void
  theme: ThemeType
}
const Wrapper = styled.View`
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
