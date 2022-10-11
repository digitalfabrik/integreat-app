import * as React from 'react'
import { ReactElement } from 'react'
import { TFunction } from 'react-i18next'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { ThemeType } from 'build-configs'

import Pagination from './Pagination'
import SlideButton from './SlideButton'

export const ButtonContainer = styled.View`
  flex-grow: 1;
  flex-direction: row;
  padding: 5px;
  background-color: ${props => props.theme.colors.backgroundColor};
`
type SlideFooterPropsType = {
  slideCount: number
  currentSlide: number
  goToSlide: (index: number) => void
  onDone: () => Promise<void>
  theme: ThemeType
  t: TFunction<['intro', 'settings']>
}

const SlideFooter = ({ onDone, theme, slideCount, goToSlide, currentSlide, t }: SlideFooterPropsType): ReactElement => {
  const goToNextSlide = () => goToSlide(currentSlide + 1)

  const isLastSlide = currentSlide === slideCount - 1
  return (
    <View>
      <ButtonContainer>
        {!isLastSlide ? <SlideButton label={t('skip')} onPress={onDone} theme={theme} /> : <View style={{ flex: 1 }} />}
        <SlideButton label={t('next')} onPress={isLastSlide ? onDone : goToNextSlide} theme={theme} />
      </ButtonContainer>
      <Pagination slideCount={slideCount} currentSlide={currentSlide} goToSlide={goToSlide} />
    </View>
  )
}

export default SlideFooter
