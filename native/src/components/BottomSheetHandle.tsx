import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

const Handle = styled.View`
  width: 34px;
  border: 1px solid ${props => props.theme.colors.textSecondaryColor};
  background-color: ${props => props.theme.colors.textSecondaryColor};
  border-radius: 10px;
  align-self: center;
  margin: 20px 0;
`

const BottomSheetHandle = (): ReactElement => <Handle />

export default BottomSheetHandle
