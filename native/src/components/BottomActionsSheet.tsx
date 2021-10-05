import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import React, { ReactElement, ReactNode, useCallback, useRef } from 'react'

import BottomSheetHandler from './BottomSheetHandler'

type BottomActionsSheetProps = {
  content: ReactNode
  snapPoints: (string | number)[]
  headerText?: string
  visible?: boolean
  onChange?: (index: number) => void
}

const BottomActionsSheet: React.FC<BottomActionsSheetProps> = ({
  content,
  headerText,
  visible = true,
  onChange,
  snapPoints
}: BottomActionsSheetProps): ReactElement | null => {
  const bottomSheetRef = useRef<BottomSheet>(null)

  const renderHandle = useCallback(props => <BottomSheetHandler headerText={headerText} {...props} />, [headerText])

  if (!visible) {
    return null
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      animateOnMount={true}
      handleComponent={renderHandle}
      onChange={onChange}>
      <BottomSheetScrollView>{content}</BottomSheetScrollView>
    </BottomSheet>
  )
}

export default BottomActionsSheet
