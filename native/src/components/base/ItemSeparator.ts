import { StyleSheet } from 'react-native'
import styled from 'styled-components/native'

const ItemSeparator = styled.View`
  background-color: ${props => props.theme.colors.textDecorationColor};
  height: ${StyleSheet.hairlineWidth}px;
`

export default ItemSeparator
