// @flow

import { SafeAreaView } from 'react-native'
import styled from 'styled-components/native'
import withTheme from '../../theme/hocs/withTheme'

const IOSSafeAreaView = styled(SafeAreaView)`
  flex: 1;
  background-color: ${props => props.theme.colors.backgroundAccentColor};
`

export default withTheme()(IOSSafeAreaView)
