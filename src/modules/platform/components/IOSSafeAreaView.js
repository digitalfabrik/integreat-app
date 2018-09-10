import { SafeAreaView } from 'react-native'
import styled from 'styled-components'

export default styled(SafeAreaView)`
  flex: 1;
  background-color: ${props => props.theme.colors.backgroundAccentColor};
`
