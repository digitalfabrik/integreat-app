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

const StyledButton = styled(TextButton)<{ $opacity?: boolean; $enableShadow?: boolean }>`
  padding: 10px 32px;
  opacity: ${props => (props.$opacity === false ? 0 : 1)};
  shadow-color: ${props =>
    props.$enableShadow ? props.theme.legacy.colors.textColor : props.theme.legacy.colors.backgroundColor};
  shadow-offset: 0 1px;
  shadow-opacity: 0.2;
  shadow-radius: 1.4px;
  elevation: 2;
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
        <StyledButton
          type='clear'
          text={t('skip')}
          textStyle={{ fontFamily: theme.legacy.fonts.native.contentFontBold, fontSize: 14 }}
          onPress={onDone}
          $opacity={!isLastSlide}
          disabled={isLastSlide}
        />

        <StyledButton
          type='primary'
          text={t('next')}
          textStyle={{ fontFamily: theme.legacy.fonts.native.contentFontBold, fontSize: 14 }}
          onPress={isLastSlide ? onDone : goToNextSlide}
          $enableShadow
        />
      </ButtonContainer>
    </SideFooterContainer>
  )
}

export default SlideFooter
