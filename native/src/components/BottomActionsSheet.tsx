import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import React, { ReactElement, ReactNode, useCallback, useMemo, useRef } from 'react'

import dimensions from '../constants/dimensions'
import BottomSheetHandler from './BottomSheetHandler'

type BottomActionsSheetProps = {
  content: ReactNode
  headerText?: string
  hide?: boolean
}

const BottomActionsSheet: React.FC<BottomActionsSheetProps> = ({
  content,
  headerText,
  hide = false
}: BottomActionsSheetProps): ReactElement | null => {
  const bottomSheetRef = useRef<BottomSheet>(null)

  // set points to snap
  const snapPoints = useMemo(() => [dimensions.bottomSheetHandler.height, '25%', '95%'], [])

  const renderHandle = useCallback(props => <BottomSheetHandler headerText={headerText} {...props} />, [headerText])

  if (hide) {
    return null
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      animateOnMount={true}
      handleComponent={renderHandle}>
      <BottomSheetScrollView>{content}</BottomSheetScrollView>
    </BottomSheet>
  )
}

export default BottomActionsSheet
