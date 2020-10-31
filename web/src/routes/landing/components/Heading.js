// @flow

import React from 'react'

import styled from 'styled-components'
import buildConfig from '../../../modules/app/constants/buildConfig'

const Logo = styled.img`
  display: block;
  height: 70px;
  margin: 0 auto;
`

const Heading = () => <Logo src={buildConfig().web.icons.locationIcon} alt='' />

export default Heading
