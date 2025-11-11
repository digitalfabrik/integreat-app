import { range } from 'lodash'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import Pressable from './base/Pressable'

const DotsContainer = styled.View`
  height: 12px;
  padding: 10px 10px 20px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.legacy.colors.backgroundColor};
`

const Dot = styled.View<{ isActive: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: ${props =>
    props.isActive ? props.theme.legacy.colors.textColor : props.theme.legacy.colors.textDecorationColor};
`

const DotPressableArea = styled(Pressable)`
  width: 35px;
  height: 35px;
  margin: 0 8px;
  justify-content: center;
  align-items: center;
`

type PaginationProps = {
  slideCount: number
  currentSlide: number
  goToSlide: (index: number) => void
}

const Pagination = ({ slideCount, currentSlide, goToSlide }: PaginationProps): ReactElement => {
  const goToSlideIndex = (index: number) => () => goToSlide(index)
  const { t } = useTranslation('error')

  return (
    <DotsContainer>
      {range(slideCount).map(index => (
        <DotPressableArea
          key={index}
          onPress={goToSlideIndex(index)}
          role='link'
          accessibilityLabel={t('goTo.pageNumber', {
            number: index + 1,
          })}>
          <Dot isActive={index === currentSlide} />
        </DotPressableArea>
      ))}
    </DotsContainer>
  )
}

export default Pagination
