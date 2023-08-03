import React, { ReactElement } from 'react'
import { TFunction } from 'react-i18next'
import { View } from 'react-native'
import styled from 'styled-components/native'

import Pagination from './Pagination'
import TextButton from './TextButton'

const ButtonContainer = styled.View`
  flex-grow: 1;
  flex-direction: row;
  padding: 5px;
  background-color: ${props => props.theme.colors.backgroundColor};
`

const StyledButton = styled(TextButton)`
  flex: 1;
`

const Placeholder = styled.View`
  flex: 1;
`

type SlideFooterProps = {
  slideCount: number
  currentSlide: number
  goToSlide: (index: number) => void
  onDone: () => Promise<void>
  t: TFunction<['intro', 'settings']>
}

const SlideFooter = ({ onDone, slideCount, goToSlide, currentSlide, t }: SlideFooterProps): ReactElement => {
  const goToNextSlide = () => goToSlide(currentSlide + 1)

  const isLastSlide = currentSlide === slideCount - 1
  return (
    <View>
      <ButtonContainer>
        {!isLastSlide ? <StyledButton type='clear' text={t('skip')} onPress={onDone} /> : <Placeholder />}
        <StyledButton type='clear' text={t('next')} onPress={isLastSlide ? onDone : goToNextSlide} />
      </ButtonContainer>
      <Pagination slideCount={slideCount} currentSlide={currentSlide} goToSlide={goToSlide} />
    </View>
  )
}

export default SlideFooter
