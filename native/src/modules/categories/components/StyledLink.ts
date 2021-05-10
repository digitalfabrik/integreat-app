import styled from 'styled-components/native'
import { StyledComponent } from 'styled-components'
import 'styled-components'
import { ThemeType } from '../../theme/constants'
const StyledLink: StyledComponent<{}, ThemeType, any> = styled.TouchableHighlight`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 0 20px;
`
export default StyledLink
