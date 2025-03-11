import React, { ReactElement } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated'
import styled from 'styled-components/native'

const StyledWrapper = styled.View`
  width: 100%;
  position: absolute;
  display: flex;
  align-items: center;
`

const StyledAnimatedView = styled(Animated.View)`
  width: 100%;
  overflow: hidden;
`

type AccordionProps = {
  isOpen: boolean
  style?: StyleProp<ViewStyle>
  children: React.ReactNode
  duration?: number
  viewKey: string
}

const defaultDuration = 500

const Accordion = ({ isOpen, style, duration = defaultDuration, children, viewKey }: AccordionProps): ReactElement => {
  const height = useSharedValue(0)
  const derivedHeight = useDerivedValue(() =>
    withTiming(height.value * Number(isOpen), {
      duration,
    }),
  )
  const bodyStyle = useAnimatedStyle(() => ({
    height: derivedHeight.value,
  }))
  return (
    <StyledAnimatedView key={`accordionItem-${viewKey}`} style={[bodyStyle, style]}>
      <StyledWrapper
        onLayout={e => {
          height.value = e.nativeEvent.layout.height
        }}>
        {children}
      </StyledWrapper>
    </StyledAnimatedView>
  )
}

export default Accordion
