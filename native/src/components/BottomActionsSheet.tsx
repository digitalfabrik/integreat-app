import React, { ReactElement, ReactNode, useState } from 'react'
import { ScrollView } from 'react-native'
import { View } from 'react-native'
import ActionSheet from 'react-native-actions-sheet'
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
  const actionSheetRef = React.useRef<ActionSheet | null>(null)
  const [showButton, setShowButton] = useState<boolean>(true)

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
      <ActionSheet
        ref={actionSheetRef}
        gestureEnabled={true}
        closeOnTouchBackdrop={true}
        closable={true}
        initialOffsetFromBottom={10}
        bottomOffset={10}
        onOpen={() => setShowButton(false)}
        onClose={() => setShowButton(true)}
        CustomHeaderComponent={CustomHeader}
        springOffset={100}>
        <ScrollView
          nestedScrollEnabled={true}
          onMomentumScrollEnd={() => actionSheetRef.current?.handleChildScrollEnd()}>
          {content}
        </ScrollView>
      </ActionSheet>
      {showButton && (
        <SheetButton onTouchMove={() => actionSheetRef.current?.show()}>
          <Indicator />
        </SheetButton>
      )}
    </View>
  )
}

export default BottomActionsSheet
