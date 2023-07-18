import BottomSheet, {
  BottomSheetHandleProps,
  BottomSheetScrollView,
  BottomSheetScrollViewMethods,
} from '@gorhom/bottom-sheet'
import React, { memo, ReactElement, ReactNode, useCallback } from 'react'
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
  setScrollPosition: (position: number) => void
}

const StyledBottomSheet = styled(BottomSheet)<{ isFullscreen: boolean }>`
  ${props => props.isFullscreen && `background-color: white;`}
`

const BottomActionsSheet = React.forwardRef(
  (
    {
      children,
      title,
      visible = true,
      onChange,
      snapPoints,
      initialIndex = 0,
      setScrollPosition,
      snapPointIndex,
    }: BottomActionsSheetProps,
    scrollRef: React.Ref<BottomSheetScrollViewMethods>
  ): ReactElement | null => {
    const renderHandle = useCallback(
      (props: BottomSheetHandleProps) => <BottomSheetHandler title={title} {...props} />,
      [title]
    )

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
        <BottomSheetScrollView
          onScrollEndDrag={event => setScrollPosition(event.nativeEvent.contentOffset.y)}
          ref={scrollRef}>
          {children}
        </BottomSheetScrollView>
      </StyledBottomSheet>
    )
  }
)

export default memo(BottomActionsSheet)
