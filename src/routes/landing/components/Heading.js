// @flow

import React from 'react'

import styled from 'styled-components'

const Logo = styled.img`
  display: block;
  height: 70px;
  margin: 0 auto;
`

const Heading = () => <Logo src={__CONFIG__.locationIcon} />

export default Heading
