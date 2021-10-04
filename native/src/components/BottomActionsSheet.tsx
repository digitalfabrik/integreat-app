import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import React, { ReactElement, ReactNode, useCallback, useMemo, useRef } from 'react'

import dimensions from '../constants/dimensions'
import BottomSheetHandler from './BottomSheetHandler'

type BottomActionsSheetProps = {
  content: ReactNode
  headerText?: string
}

const BottomActionsSheet: React.FC<BottomActionsSheetProps> = ({
  content,
  headerText
}: BottomActionsSheetProps): ReactElement => {
  const bottomSheetRef = useRef<BottomSheet>(null)

  // variables
  const snapPoints = useMemo(() => [dimensions.bottomSheetHandler.height, '25%', '100%'], [])

  const renderHandle = useCallback(props => <BottomSheetHandler headerText={headerText} {...props} />, [headerText])

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
