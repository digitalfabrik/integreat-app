import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import dimensions from '../constants/dimensions'
import Icon from './base/Icon'
import Text from './base/Text'

const Container = styled.View`
  min-height: ${dimensions.bottomSheetHandle.height}px;
  justify-content: center;
  padding: 12px 0 8px;
`

const Handle = styled.Pressable`
  align-items: center;
`

const StyledIcon = styled(Icon)`
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
  const { t } = useTranslation('common')
  return (
    <Container>
      <Handle
        focusable
        // @ts-expect-error Pressable doesn't have a type for nextFocusForward but it is a valid prop
        nextFocusForward={nextFocusForward}
        onPress={onPress}
        accessibilityLabel={t('handle')}>
        <StyledIcon size={32} source={isFullscreen ? 'chevron-down' : 'chevron-up'} />
      </Handle>
      {!!title && <StyledTitle variant='h5'>{title}</StyledTitle>}
    </Container>
  )
}

export default BottomSheetHandle
