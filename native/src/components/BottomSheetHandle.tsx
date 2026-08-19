import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import dimensions from '../constants/dimensions'
import Icon from './base/Icon'
import Text from './base/Text'

const Handle = styled.Pressable`
  min-height: ${dimensions.bottomSheetHandle.height}px;
  justify-content: center;
  width: 100%;
  padding: 12px 0 8px;
`

const StyledIcon = styled(Icon)`
  align-self: center;
  transform: scaleX(1.5);
`

const StyledTitle = styled(Text)`
  margin: 0 24px;
`

type BottomSheetHandleProps = {
  nextFocusForward?: number
  isFullscreen: boolean
  title?: string
  onPress: () => void
}

const BottomSheetHandle = ({
  nextFocusForward,
  isFullscreen,
  title,
  onPress,
}: BottomSheetHandleProps): ReactElement => {
  const { t } = useTranslation(['common'])
  return (
    <Handle
      focusable
      // @ts-expect-error Pressable doesn't have a type for nextFocusForward but it is a valid prop
      nextFocusForward={nextFocusForward}
      onPress={onPress}
      accessibilityLabel={t($ => $.handle)}
      accessibilityState={{ expanded: isFullscreen }}
      accessibilityHint={title}>
      <StyledIcon source={isFullscreen ? 'chevron-down' : 'chevron-up'} />
      {!!title && <StyledTitle variant='h5'>{title}</StyledTitle>}
    </Handle>
  )
}

export default BottomSheetHandle
