// @flow

import * as React from 'react'
import styled from 'styled-components/native'
import { StyleSheet } from 'react-native'
import type { ThemeType } from '../../theme/constants/theme'
import type { StyledComponent } from 'styled-components'

const Loader: StyledComponent<{}, ThemeType, *> = styled.ActivityIndicator`
  margin-top: 15px;
`

type PropsType = {| style?: StyleSheet.Styles |}

export default (props: PropsType) => <Loader {...props} />
