// @flow

import styled from 'styled-components/native'
import { type StyledComponent } from 'styled-components'
import type { ThemeType } from '../../theme/constants/theme'

const CategoryCaption: StyledComponent<{}, ThemeType, *> = styled.View`
  align-self: center;
  padding: 15px 5px;
  border-bottom-width: 2px;
  border-bottom-color: ${props => props.theme.colors.themeColor};
  flex: 1;
`

export default CategoryCaption
