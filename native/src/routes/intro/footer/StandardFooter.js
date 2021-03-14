// @flow

import * as React from 'react'
import SlideButton from './SlideButton'
import Pagination from './Pagination'
import styled from 'styled-components/native'
import { type StyledComponent } from 'styled-components'
import type { ThemeType } from '../../../modules/theme/constants'
import type { TFunction } from 'react-i18next'
import { View } from 'react-native'

export const ButtonContainer: StyledComponent<{}, ThemeType, *> = styled.View`
  flex-direction: row;
  padding: 5px;
  background-color: ${props => props.theme.colors.backgroundColor};
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

  render() {
    const { theme, slideCount, goToSlide, currentSlide, t } = this.props

    return (
      <View>
        <ButtonContainer theme={theme}>
          <SlideButton label={t('skip')} onPress={this.goToPreviousSlide} theme={theme} />
          <SlideButton label={t('next')} onPress={this.goToNextSlide} theme={theme} />
        </ButtonContainer>
        <Pagination slideCount={slideCount} currentSlide={currentSlide} goToSlide={goToSlide} theme={theme} />
      </View>
    )
  }
}

export default StandardFooter
