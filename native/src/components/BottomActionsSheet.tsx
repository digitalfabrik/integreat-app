import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import React, { ReactElement, ReactNode, useCallback } from 'react'

import BottomSheetHandler from './BottomSheetHandler'

type BottomActionsSheetProps = {
  children: ReactNode
  snapPoints: (string | number)[]
  title?: string
  visible?: boolean
  onChange?: (index: number) => void
  initialIndex: number
}

const BottomActionsSheet: React.FC<BottomActionsSheetProps> = ({
  children,
  title,
  visible = true,
  onChange,
  snapPoints,
  initialIndex = 0
}: BottomActionsSheetProps): ReactElement | null => {
  const renderHandle = useCallback(props => <BottomSheetHandler title={title} {...props} />, [title])

  if (!visible) {
    return null
  }

  return (
    <BottomSheet
      index={initialIndex}
      snapPoints={snapPoints}
      animateOnMount
      handleComponent={renderHandle}
      onChange={onChange}>
      <BottomSheetScrollView>{children}</BottomSheetScrollView>
    </BottomSheet>
  )
}

export default BottomActionsSheet
