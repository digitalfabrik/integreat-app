// @flow

import React from 'react'
import styled from 'styled-components/native'
import { type StyledComponent } from 'styled-components'
import type { ThemeType } from '../../../modules/theme/constants'
import { range } from 'lodash'

const DotsContainer: StyledComponent<{}, ThemeType, *> = styled.View`
  flex: 1;
  height: 10px;
  padding: 10px 10px 20px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.colors.backgroundColor};
`

const Dot: StyledComponent<{ isActive: boolean }, ThemeType, *> = styled.TouchableOpacity`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  margin-horizontal: 4px;
  background-color: ${props =>
    props.isActive ? props.theme.colors.textSecondaryColor : props.theme.colors.textDecorationColor};
`

type PropsType = {|
  slideCount: number,
  currentSlide: number,
  goToSlide: (index: number) => void,
  theme: ThemeType
|}

class Pagination extends React.Component<PropsType> {
  render() {
    const { slideCount, currentSlide, goToSlide, theme } = this.props
    const goToSlideIndex = (index: number) => () => goToSlide(index)
    return (
      <DotsContainer theme={theme}>
        {range(slideCount).map(index => (
          <Dot key={index} isActive={index === currentSlide} onPress={goToSlideIndex(index)} theme={theme} />
        ))}
      </DotsContainer>
    )
  }
}

export default Pagination
