// @flow

import * as React from 'react'
import SlideButton from './SlideButton'
import Pagination from './Pagination'
import styled, { type StyledComponent } from 'styled-components/native'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import type { TFunction } from 'react-i18next'

export const FooterContainer: StyledComponent<{}, ThemeType, *> = styled.View`
  flex: 0.15;
  flex-direction: row;
  padding: 16px 10px;
  background-color: ${props => props.theme.colors.backgroundColor};
  align-self: flex-end;
  align-content: flex-end;
  justify-content: flex-end;
`

type PropsType = {|
  slideCount: number,
  currentSlide: number,
  goToSlide: (index: number) => void,
  theme: ThemeType,
  t: TFunction
|}

class StandardFooter extends React.Component<PropsType> {
  goToPreviousSlide = () => this.props.goToSlide(this.props.slideCount - 1)
  goToNextSlide = () => this.props.goToSlide(this.props.currentSlide + 1)

  render () {
    const { theme, slideCount, goToSlide, currentSlide, t } = this.props

    return <FooterContainer theme={theme}>
      <SlideButton label={t('skip')} onPress={this.goToPreviousSlide} theme={theme} />
      <Pagination slideCount={slideCount} currentSlide={currentSlide} goToSlide={goToSlide} theme={theme} />
      <SlideButton label={t('next')} onPress={this.goToNextSlide} theme={theme} />
    </FooterContainer>
  }
}

export default StandardFooter
