import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

const Handle = styled.Pressable`
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
  // @ts-expect-error Pressable doesn't have a type for nextFocusForward but it is a valid prop
  <Handle focusable nextFocusForward={nextFocusForward} />
)

export default BottomSheetHandle
