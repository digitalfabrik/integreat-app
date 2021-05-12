// @flow

import styled, { type StyledComponent } from 'styled-components'
import type { ThemeType } from 'build-configs/ThemeType'

const StyledSmallViewTip: StyledComponent<{||}, ThemeType, *> = styled.p`
  display: block;
  font-size: 12px;
  font-weight: 700;
`
export default StyledSmallViewTip
