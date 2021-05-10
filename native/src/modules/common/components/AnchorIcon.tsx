import React from 'react'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { StyledComponent } from 'styled-components'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'
import { isRTL } from '../../i18n/contentDirection'
const anchorWidth = 30
const widthThreshold = 10
const Icon: StyledComponent<
  {
    width: number
  },
  {},
  any
> = styled(MaterialIcon)`
  font-size: 30px;
  width: ${props => props.width}px;
`
type PropsType = {
  navigationItemWidth: number
  name: string
  _scrollView: React$ElementRef<typeof ScrollView> | null | undefined
  language: string
  xPosition: number
  contentSizeDiff: number
}

class AnchorIcon extends React.Component<PropsType> {
  onAnchorPress = () => {
    const { navigationItemWidth, _scrollView, xPosition, contentSizeDiff } = this.props
    const didReachLastItem = parseInt(xPosition.toFixed(0)) + widthThreshold > contentSizeDiff

    // when everything is at starting point and xPosition is zero
    if (_scrollView) {
      if (!xPosition) {
        _scrollView.scrollTo({
          y: 0,
          x: navigationItemWidth,
          animated: true
        }) // When we reach the last element
      } else if (didReachLastItem) {
        _scrollView.scrollTo({
          y: 0,
          x: -1,
          animated: true
        })
      } else {
        _scrollView.scrollTo({
          y: 0,
          x: xPosition + navigationItemWidth,
          animated: true
        })
      }
    }
  }

  render() {
    const { name } = this.props
    return (
      <Icon
        name={name}
        style={{
          transform: [
            {
              scaleX: isRTL() ? -1 : 1
            }
          ]
        }}
        onPress={this.onAnchorPress}
        width={anchorWidth}
      />
    )
  }
}

export default AnchorIcon
