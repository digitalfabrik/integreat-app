import BottomSheet, {
  BottomSheetHandleProps,
  BottomSheetScrollView,
  BottomSheetScrollViewMethods,
} from '@gorhom/bottom-sheet'
import React, { ReactElement, ReactNode, useCallback, useEffect, useRef } from 'react'
import styled from 'styled-components/native'

import BottomSheetHandler from './BottomSheetHandler'

type BottomActionsSheetProps = {
  children: ReactNode
  snapPoints: (string | number)[]
  title?: string
  visible?: boolean
  onChange?: (index: number) => void
  initialIndex: number
  snapPointIndex: number
}

const StyledBottomSheet = styled(BottomSheet)<{ isFullscreen: boolean }>`
  ${props => props.isFullscreen && `background-color: white;`}
`

const BottomActionsSheet: React.FC<BottomActionsSheetProps> = ({
  children,
  title,
  visible = true,
  onChange,
  snapPoints,
  initialIndex = 0,
  snapPointIndex,
}: BottomActionsSheetProps): ReactElement | null => {
  const renderHandle = useCallback(
    (props: BottomSheetHandleProps) => <BottomSheetHandler title={title} {...props} />,
    [title]
  )

  const scrollRef = useRef<BottomSheetScrollViewMethods>(null)

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
    <StyledBottomSheet
      index={initialIndex}
      isFullscreen={snapPointIndex === 2}
      snapPoints={snapPoints}
      animateOnMount
      handleComponent={renderHandle}
      onChange={onChange}>
      <BottomSheetScrollView ref={scrollRef}>{children}</BottomSheetScrollView>
    </StyledBottomSheet>
  )
}

export default BottomActionsSheet
