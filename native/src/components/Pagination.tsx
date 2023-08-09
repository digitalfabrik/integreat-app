import { range } from 'lodash'
import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import Pressable from './base/Pressable'

const DotsContainer = styled.View`
  flex: 1;
  height: 10px;
  padding: 10px 10px 20px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.colors.backgroundColor};
`
const Dot = styled(Pressable)<{ isActive: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  margin: 0 4px;
  background-color: ${props =>
    props.isActive ? props.theme.colors.textSecondaryColor : props.theme.colors.textDecorationColor};
`
type PaginationProps = {
  slideCount: number
  currentSlide: number
  goToSlide: (index: number) => void
}

const Pagination = ({ slideCount, currentSlide, goToSlide }: PaginationProps): ReactElement => {
  const goToSlideIndex = (index: number) => () => goToSlide(index)

  return (
    <DotsContainer>
      {range(slideCount).map(index => (
        <Dot key={index} isActive={index === currentSlide} onPress={goToSlideIndex(index)} />
      ))}
    </DotsContainer>
  )
}

export default Pagination
