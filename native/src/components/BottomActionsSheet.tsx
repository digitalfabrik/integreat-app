import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import React, { ReactElement, ReactNode, useMemo, useRef, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import styled from 'styled-components/native'

type BottomActionsSheetProps = {
  content: ReactNode
  headerText?: string
  customIndicator?: ReactElement
}

const SheetHeader = styled.View`
  justify-content: center;
  flex-direction: row;
  margin-bottom: 16px;
`

const HeaderText = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
`

const Indicator = styled.View`
  width: 30px;
  border: 1px solid #585858;
  align-self: center;
  margin: 16px 0;
`

const SheetButton = styled.View`
  position: absolute;
  bottom: 0;
  background-color: white;
  width: 100%;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`

const BottomActionsSheet: React.FC<BottomActionsSheetProps> = ({
  content,
  customIndicator,
  headerText
}: BottomActionsSheetProps): ReactElement => {
  const [showButton, setShowButton] = useState<boolean>(true)
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null)

  // variables
  const snapPoints = useMemo(() => ['25%', '50%', '75'], [])

  const CustomHeader = (
    <View>
      {customIndicator ?? <Indicator />}
      {headerText && (
        <SheetHeader>
          <HeaderText>{headerText}</HeaderText>
        </SheetHeader>
      )}
    </View>
  )

  return (
    <View>
      <BottomSheet ref={bottomSheetRef} index={1} snapPoints={snapPoints}>
        <BottomSheetScrollView>{content}</BottomSheetScrollView>
      </BottomSheet>
    </View>
  )
}

export default BottomActionsSheet
