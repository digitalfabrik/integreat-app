// @flow

import * as React from 'react'
import styled from 'styled-components/native'
import type { ThemeType } from '../../theme/constants/theme'
import type { StyledComponent } from 'styled-components'
import type {
  ViewStyleProp
} from 'react-native/Libraries/StyleSheet/StyleSheet'

type PropsType = {| style?: ViewStyleProp |}

const Loader: StyledComponent<PropsType, ThemeType, *> = styled.ActivityIndicator`
  margin-top: 15px;
`

export default (props: PropsType) => <Loader {...props} />
