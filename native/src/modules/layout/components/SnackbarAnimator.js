// @flow

import * as React from 'react'
import { Animated } from 'react-native'
import type { StyledComponent } from 'styled-components'
import styled from 'styled-components/native'
import type { ViewLayoutEvent } from 'react-native/Libraries/Components/View/ViewPropTypes'

type PropsType = {|
  children: ?React$Element<*>
|}

type StateType = {|
  translate: Animated.Value,
  height: ?number,
  status: 'in' | 'out' | 'animating',
  displayed: ?React$Element<*>
|}

const Container: StyledComponent<{}, {}, *> = styled(Animated.View)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`

const ANIMATION_DURATION = 300
const MAX_HEIGHT = 9999

const getKey = (element: ?React$Element<*>): ?React$Key => (element ? React.Children.only(element).key : null)

class SnackbarAnimator extends React.Component<PropsType, StateType> {
  state = { translate: new Animated.Value(1), height: null, displayed: null, status: 'out' }

  componentDidMount() {
    this.checkForUpdate()
  }

  checkForUpdate = () => {
    const { displayed, status } = this.state
    const children = this.props.children
    if (getKey(displayed) !== getKey(children)) {
      // displayed doesn't correspond to current
      if (status === 'in') {
        this.setState({ status: 'animating' })
        this.hide()
      } else if (status === 'out' && children) {
        this.setState({ displayed: children, status: 'animating' })
        this.show()
      }
    }
  }

  show = () =>
    Animated.timing(this.state.translate, {
      toValue: 0,
      duration: ANIMATION_DURATION,
      useNativeDriver: true
    }).start(this.onShowEnd)

  hide = () =>
    Animated.timing(this.state.translate, {
      toValue: 1,
      duration: ANIMATION_DURATION,
      useNativeDriver: true
    }).start(this.onHideEnd)

  onShowEnd = () => {
    this.setState({ status: 'in' })
    this.checkForUpdate()
  }

  onHideEnd = () => {
    this.setState({ displayed: null, status: 'out' })
    this.checkForUpdate()
  }

  componentDidUpdate(prevProps: PropsType) {
    const children = this.props.children
    const displayed = this.state.displayed
    if (prevProps.children !== children) {
      if (children && displayed && getKey(children) === getKey(displayed)) {
        this.setState({ displayed: children })
      }
      this.checkForUpdate()
    }
  }

  onLayout = (event: ViewLayoutEvent) => this.setState({ height: event.nativeEvent.layout.height })

  render() {
    const { translate, height, displayed } = this.state
    const outputRange: number[] = [0, height || MAX_HEIGHT]
    const interpolated = translate.interpolate({ inputRange: [0, 1], outputRange: outputRange })
    return (
      <Container onLayout={this.onLayout} style={{ transform: [{ translateY: interpolated }] }}>
        {displayed}
      </Container>
    )
  }
}

export default SnackbarAnimator
