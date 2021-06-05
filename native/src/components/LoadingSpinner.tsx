import * as React from 'react'
import styled from 'styled-components/native'
import { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet'

type PropsType = {
  style?: ViewStyleProp
}
const Loader = styled.ActivityIndicator`
  margin-top: 15px;
`
export default (props: PropsType) => <Loader {...props} />
