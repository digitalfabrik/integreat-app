import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

const Handle = styled.TouchableOpacity`
  width: 34px;
  border: 1px solid ${props => props.theme.colors.onSurfaceVariant};
  background-color: ${props => props.theme.colors.onSurfaceVariant};
  border-radius: 10px;
  align-self: center;
  margin: 20px 0;
`

type BottomSheetHandleProps = {
  nextFocusForward?: number
}

const BottomSheetHandle = ({ nextFocusForward }: BottomSheetHandleProps): ReactElement => (
  <Handle focusable nextFocusForward={nextFocusForward} />
)

export default BottomSheetHandle
