// @flow

import styled, { type StyledComponent } from 'styled-components'
import Link from 'redux-first-router-link'
import type { ThemeType } from 'build-configs/ThemeType'

const CleanLink: StyledComponent<{||}, ThemeType, *> = styled(Link)`
  color: inherit;
  text-decoration: none;
`

export default CleanLink
