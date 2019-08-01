// @flow

import * as React from 'react'

import LocationBig from '../assets/LocationBig.png'
import styled, { type StyledComponent } from 'styled-components/native'

const LocationImage = styled.Image`
  height: 70px;
  resize-mode: contain;
`

const Wrapper: StyledComponent<{| children: React.Node |}, {}, *> = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
`

class Heading extends React.Component<{||}> {
  render () {
    return (
      <Wrapper>
        <LocationImage source={LocationBig} />
      </Wrapper>
    )
  }
}

export default Heading
