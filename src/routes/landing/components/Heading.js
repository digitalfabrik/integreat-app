// @flow

import React from 'react'

import LocationBig from '../assets/LocationBig.svg'
import styled from 'styled-components'

const Logo = styled.img`
  display: block;
  height: 70px;
  margin: 0 auto;
`
const Heading = () => <Logo src={LocationBig} />

export default Heading
