import { TFunction } from 'i18next'
import React, { ReactElement } from 'react'
import styled, { useTheme } from 'styled-components/native'

import Pagination from './Pagination'
import TextButton from './base/TextButton'

const ButtonContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 20px;
`

const StyledButton = styled(TextButton)`
  /* flex: 1; */
  width: 139px;
  height: 40px;
`

const Placeholder = styled.View`
  flex: 1;
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
        {!isLastSlide ? (
          <StyledButton
            type='clear'
            text={t('skip')}
            textStyle={{ fontFamily: theme.fonts.native.contentFontBold, fontSize: 14 }}
            onPress={onDone}
          />
        ) : (
          <Placeholder />
        )}
        <StyledButton
          type='primary'
          text={t('next')}
          textStyle={{ fontFamily: theme.fonts.native.contentFontBold, fontSize: 14 }}
          onPress={isLastSlide ? onDone : goToNextSlide}
        />
      </ButtonContainer>
    </SideFooterContainer>
  )
}

export default SlideFooter
