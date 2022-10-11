import React, { memo, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { CityModel, LOCAL_NEWS_TYPE, NewsType, TU_NEWS_TYPE } from 'api-client'

import activeInternational from '../assets/tu-news-active.svg'
import inactiveInternational from '../assets/tu-news-inactive.svg'
import Caption from './Caption'

const NewsTypeIcon = styled.Image`
  align-self: center;
`
const TouchableWrapper = styled.TouchableOpacity`
  margin-bottom: 5px;
  margin-horizontal: 10px;
`
const LocalTabWrapper = styled.View<{ isSelected: boolean }>`
  padding-horizontal: 10px;
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

type NewsHeaderPropsType = {
  cityModel: CityModel
  selectedNewsType: NewsType
  navigateToNews: (newsType: NewsType) => void
}

const NewsHeader = ({ cityModel, selectedNewsType, navigateToNews }: NewsHeaderPropsType): ReactElement => {
  const { t } = useTranslation('news')
  const navigateToLocalNews = () => navigateToNews(LOCAL_NEWS_TYPE)
  const navigateToTuNews = () => navigateToNews(TU_NEWS_TYPE)

  return (
    <>
      <Caption title={t('news')} />
      {cityModel.localNewsEnabled && cityModel.tunewsEnabled && (
        <HeaderContainer>
          <TouchableWrapper onPress={navigateToLocalNews} accessibilityRole='button' accessibilityLabel={t('local')}>
            <LocalTabWrapper isSelected={selectedNewsType === LOCAL_NEWS_TYPE}>
              <LocalText>{t('local')}</LocalText>
            </LocalTabWrapper>
          </TouchableWrapper>
          <TouchableWrapper onPress={navigateToTuNews} accessibilityRole='button' accessibilityLabel='TüNews'>
            <NewsTypeIcon source={selectedNewsType === TU_NEWS_TYPE ? activeInternational : inactiveInternational} />
          </TouchableWrapper>
        </HeaderContainer>
      )}
    </>
  )
}

export default memo(NewsHeader)
