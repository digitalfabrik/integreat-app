import { range } from 'lodash'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import Pressable from './base/Pressable'

const DotsContainer = styled.View`
  flex: 1;
  height: 12px;
  padding: 10px 10px 20px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.colors.backgroundColor};
`

const Dot = styled(Pressable)<{ isActive: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  margin: 0 18px;
  background-color: ${props =>
    props.isActive ? props.theme.colors.textColor : props.theme.colors.textDecorationColor};
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
        <Dot
          hitSlop={{ bottom: 10, top: 10, left: 10, right: 10 }}
          key={index}
          isActive={index === currentSlide}
          onPress={goToSlideIndex(index)}
          role='link'
          accessibilityLabel={t('goTo.pageNumber', {
            number: index + 1,
          })}
        />
      ))}
    </DotsContainer>
  )
}

export default Pagination
