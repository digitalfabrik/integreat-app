import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import React, { ReactElement, ReactNode, useCallback, useEffect, useRef } from 'react'
import { ScrollView } from 'react-native'

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
  initialIndex = 0,
}: BottomActionsSheetProps): ReactElement | null => {
  const renderHandle = useCallback(props => <BottomSheetHandler title={title} {...props} />, [title])

  const scrollRef = useRef<ScrollView>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        y: 0,
        animated: true,
      })
    }
  }, [title])

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
      <BottomSheetScrollView ref={scrollRef}>{children}</BottomSheetScrollView>
    </BottomSheet>
  )
}

export default BottomActionsSheet
