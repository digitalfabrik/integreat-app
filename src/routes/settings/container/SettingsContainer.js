// @flow

import * as React from 'react'
import Settings from '../components/Settings'
import { withTheme } from 'styled-components/native'
import type { NavigationScreenProp } from 'react-navigation'
import type { ThemeType } from '../../../modules/theme/constants/theme'

type PropsType = {
  navigation: NavigationScreenProp<*>,
  theme: ThemeType
}

const ThemedSettings = withTheme<PropsType, _>(Settings)
export default (props: PropsType) => <ThemedSettings theme={props.theme} navigation={props.navigation} />
