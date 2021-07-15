import { SafeAreaView } from 'react-native'
import styled from 'styled-components/native'
import withTheme from '../hocs/withTheme'
import { ThemeType } from 'build-configs'
import { ComponentType } from 'react'

const IOSSafeAreaView = styled(SafeAreaView)`
  flex: 1;
`

export default withTheme(IOSSafeAreaView as (ComponentType<{theme:ThemeType}>))
