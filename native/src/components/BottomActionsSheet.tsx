import BottomSheet, {
  BottomSheetHandleProps,
  BottomSheetScrollView,
  BottomSheetScrollViewMethods,
} from '@gorhom/bottom-sheet'
import React, { ReactElement, ReactNode, useCallback } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import styled from 'styled-components/native'

import { PoiFeature } from 'api-client'

import BottomSheetHandler from './BottomSheetHandler'

type BottomActionsSheetProps = {
  children: ReactNode
  snapPoints: (string | number)[]
  title?: string
  visible?: boolean
  onChange?: (index: number) => void
  initialIndex: number
  snapPointIndex: number
  setListScrollPosition: (position: number) => void
  selectedFeature: PoiFeature | null
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
      snapPointIndex,
      setListScrollPosition,
      selectedFeature,
    }: BottomActionsSheetProps,
    scrollRef: React.Ref<BottomSheetScrollViewMethods>
  ): ReactElement | null => {
    const renderHandle = useCallback(
      (props: BottomSheetHandleProps) => <BottomSheetHandler title={title} {...props} />,
      [title]
    )

    const onScrollEndDrag = useCallback(
      (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (!selectedFeature) {
          setListScrollPosition(event.nativeEvent.contentOffset.y)
        }
      },
      [selectedFeature, setListScrollPosition]
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
        <BottomSheetScrollView onScrollEndDrag={onScrollEndDrag} ref={scrollRef}>
          {children}
        </BottomSheetScrollView>
      </StyledBottomSheet>
    )
  }
)

export default BottomActionsSheet
