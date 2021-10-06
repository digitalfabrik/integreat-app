import React, { ReactElement } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

const SheetHeader = styled.View`
  justify-content: center;
  flex-direction: row;
  margin-bottom: 20px;
`
const HeaderText = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
  font-size: 18px;
`
const Indicator = styled.View`
  width: 34px;
  border: 1px solid ${props => props.theme.colors.textSecondaryColor};
  background-color: ${props => props.theme.colors.textSecondaryColor};
  border-radius: 10px;
  align-self: center;
  margin: 20px 0;
`

type BottomSheetHandlerProps = {
  headerText?: string
}

const BottomSheetHandler: React.FC<BottomSheetHandlerProps> = ({
  headerText
}: BottomSheetHandlerProps): ReactElement => (
  <View>
    <Indicator />
    {headerText && (
      <SheetHeader>
        <HeaderText>{headerText}</HeaderText>
      </SheetHeader>
    )}
  </View>
)

export default BottomSheetHandler
