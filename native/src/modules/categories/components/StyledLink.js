// @flow

import styled from 'styled-components/native'
import { type StyledComponent } from 'styled-components'
import type { ThemeType } from '../../theme/constants'

const StyledLink: StyledComponent<{}, ThemeType, *> = styled.TouchableHighlight`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 0 20px;
`

export default StyledLink
