import React, { memo, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { CityModel, LOCAL_NEWS_TYPE, NewsType, TU_NEWS_TYPE } from 'api-client'

import ActiveInternational from '../assets/tu-news-active.svg'
import InactiveInternational from '../assets/tu-news-inactive.svg'
import Caption from './Caption'
import Pressable from './base/Pressable'

const StyledPressable = styled(Pressable)`
  margin: 0 10px 5px;
  align-items: center;
`
const LocalTabWrapper = styled.View<{ isSelected: boolean }>`
  border-radius: 10px;
  height: 34px;
  text-align: center;
  min-width: 110px;
  align-items: center;
  justify-content: center;
  background-color: ${props =>
    props.isSelected ? props.theme.colors.themeColor : props.theme.colors.textDisabledColor};
`
const LocalText = styled.Text`
  font-size: 18px;
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
  text-transform: uppercase;
  color: ${props => props.theme.colors.backgroundColor};
`
const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
`

type NewsHeaderProps = {
  cityModel: CityModel
  selectedNewsType: NewsType
  selectNewsType: (newsType: NewsType) => void
}

const NewsHeader = ({ cityModel, selectedNewsType, selectNewsType }: NewsHeaderProps): ReactElement => {
  const { t } = useTranslation('news')
  const selectLocalNews = () => selectNewsType(LOCAL_NEWS_TYPE)
  const selectTuNews = () => selectNewsType(TU_NEWS_TYPE)

  return (
    <>
      <Caption title={t('news')} />
      {cityModel.localNewsEnabled && cityModel.tunewsEnabled && (
        <HeaderContainer>
          <StyledPressable onPress={selectLocalNews} accessibilityRole='button' accessibilityLabel={t('local')}>
            <LocalTabWrapper isSelected={selectedNewsType === LOCAL_NEWS_TYPE}>
              <LocalText>{t('local')}</LocalText>
            </LocalTabWrapper>
          </StyledPressable>
          <StyledPressable onPress={selectTuNews} accessibilityRole='button' accessibilityLabel='TüNews'>
            {selectedNewsType === TU_NEWS_TYPE ? <ActiveInternational /> : <InactiveInternational />}
          </StyledPressable>
        </HeaderContainer>
      )}
    </>
  )
}

export default memo(NewsHeader)
