import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import Icon from './base/Icon'

const Handle = styled.Pressable`
  align-items: center;
  padding: 16px 0;
`

type BottomSheetHandleProps = {
  nextFocusForward?: number
  isFullscreen?: boolean
}

const BottomSheetHandle = ({ nextFocusForward, isFullscreen = false }: BottomSheetHandleProps): ReactElement => {
  const { t } = useTranslation('common')
  return (
    // @ts-expect-error Pressable doesn't have a type for nextFocusForward but it is a valid prop
    <Handle focusable nextFocusForward={nextFocusForward} accessibilityLabel={t('handle')}>
      <Icon source={isFullscreen ? 'chevron-down' : 'chevron-up'} />
    </Handle>
  )
}

export default BottomSheetHandle
