import { TFunction } from 'i18next'
import React, { ReactElement } from 'react'
import { Button } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import Pagination from './Pagination'

const ButtonContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 20px;
`

const SideFooterContainer = styled.View`
  gap: 20px;
`

type SlideFooterProps = {
  slideCount: number
  currentSlide: number
  goToSlide: (index: number) => void
  onDone: () => Promise<void>
  t: TFunction<['intro', 'settings']>
}

const SlideFooter = ({ onDone, slideCount, goToSlide, currentSlide, t }: SlideFooterProps): ReactElement => {
  const theme = useTheme()
  const goToNextSlide = () => goToSlide(currentSlide + 1)

  const isLastSlide = currentSlide === slideCount - 1
  return (
    <SideFooterContainer>
      <Pagination slideCount={slideCount} currentSlide={currentSlide} goToSlide={goToSlide} />
      <ButtonContainer>
        <Button
          mode='text'
          labelStyle={{
            fontFamily: theme.legacy.fonts.native.contentFontBold,
            color: isLastSlide ? theme.colors.action.disabled : theme.colors.onBackground,
            fontSize: 14,
          }}
          onPress={onDone}
          disabled={isLastSlide}>
          {t('skip')}
        </Button>

        <Button
          mode='elevated'
          buttonColor={theme.colors.secondary}
          labelStyle={{
            color: theme.colors.onSecondary,
            fontFamily: theme.legacy.fonts.native.contentFontBold,
            fontSize: 14,
          }}
          onPress={isLastSlide ? onDone : goToNextSlide}>
          {t('next')}
        </Button>
      </ButtonContainer>
    </SideFooterContainer>
  )
}

export default SlideFooter
