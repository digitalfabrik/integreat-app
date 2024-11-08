import React, { ReactElement } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated'

// For some reason I couldn't replicate this styling in styled-components
const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
  },
  animatedView: {
    width: '100%',
    overflow: 'hidden',
  },
})

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
    <Animated.View key={`accordionItem_${viewKey}`} style={[styles.animatedView, bodyStyle, style]}>
      <View
        onLayout={e => {
          height.value = e.nativeEvent.layout.height
        }}
        style={styles.wrapper}>
        {children}
      </View>
    </Animated.View>
  )
}

export default Accordion
