// @flow

import React from 'react'

import LocationBig from '../assets/LocationBig.svg'
import { withNamespaces } from 'react-i18next'
import styled from 'styled-components'

const Logo = styled.img`
  display: block;
  height: 70px;
  margin: 0 auto;
`

class Heading extends React.PureComponent<React.Node> {
  render () {
    return (
      <div>
        <Logo src={LocationBig} />
      </div>
    )
  }
}

export default withNamespaces('landing')(Heading)
