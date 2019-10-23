// @flow

import * as React from 'react'

import LocationBig from '../assets/LocationBig.png'
import styled, { type StyledComponent } from 'styled-components/native'
import type { ThemeType } from '../../../modules/theme/constants/theme'

const LocationImage: StyledComponent<{}, ThemeType, *> = styled.Image`
  height: 70px;
  resize-mode: contain;
`

class Heading extends React.Component<{||}> {
  render () {
    return (
      <LocationImage source={LocationBig} />
    )
  }
}

export default Heading
