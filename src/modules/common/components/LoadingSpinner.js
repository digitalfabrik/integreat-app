// @flow

import * as React from 'react'
import styled from 'styled-components/native'
import type { ThemeType } from '../../theme/constants/theme'
import type { StyledComponent } from 'styled-components'
import type {
  ViewStyleProp
} from 'react-native/Libraries/StyleSheet/StyleSheet'

const Loader: StyledComponent<{}, ThemeType, *> = styled.ActivityIndicator`
  margin-top: 15px;
`

type PropsType = {| style?: ViewStyleProp |}

export default (props: PropsType) => <Loader {...props} />
