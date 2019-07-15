// @flow

import styled, { type StyledComponent } from 'styled-components/native'
import type { ThemeType } from '../../theme/constants/theme'

const StyledLink: StyledComponent<{}, ThemeType, *> = styled.TouchableHighlight`
  display: flex;
  flex-direction: row;
  justify-content:center;
  margin: 0 20px;
`

export default StyledLink
