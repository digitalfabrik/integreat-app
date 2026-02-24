import { range } from 'lodash'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import styled from 'styled-components/native'

const DotsContainer = styled.View`
  height: 12px;
  padding: 10px 10px 20px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.colors.background};
`

const Dot = styled.View<{ isActive: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: ${props => (props.isActive ? props.theme.colors.onSurface : props.theme.colors.action.disabled)};
`

const styles = StyleSheet.create({
  TouchableRippleStyle: {
    width: 35,
    height: 35,
    marginHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

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
        <TouchableRipple
          borderless
          key={index}
          style={styles.TouchableRippleStyle}
          onPress={goToSlideIndex(index)}
          role='link'
          accessibilityLabel={t('goTo.pageNumber', {
            number: index + 1,
          })}>
          <Dot isActive={index === currentSlide} />
        </TouchableRipple>
      ))}
    </DotsContainer>
  )
}

export default Pagination
