// @flow

import React from 'react'

import styled from 'styled-components'
import appConfig from '../../../modules/app/constants/appConfig'

const Logo = styled.img`
  display: block;
  height: 70px;
  margin: 0 auto;
`

const Heading = () => <Logo src={appConfig.locationIcon} />

export default Heading
