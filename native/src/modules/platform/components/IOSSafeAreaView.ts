import { SafeAreaView } from 'react-native'
import styled from 'styled-components/native'
import withTheme from '../../theme/hocs/withTheme'
const IOSSafeAreaView = styled(SafeAreaView)`
  flex: 1;
`
export default withTheme(IOSSafeAreaView)
