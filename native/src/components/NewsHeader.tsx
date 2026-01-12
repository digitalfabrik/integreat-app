import React, { memo, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { LOCAL_NEWS_TYPE, NewsType, TU_NEWS_TYPE } from 'shared'
import { CityModel } from 'shared/api'

import { TuNewsActiveIcon, TuNewsInactiveIcon } from '../assets'
import Caption from './Caption'
import Icon from './base/Icon'
import Pressable from './base/Pressable'

const StyledPressable = styled(Pressable)`
  margin: 0 10px 5px;
  align-items: center;
`
const LocalTabWrapper = styled.View<{ isSelected: boolean }>`
  border-radius: 10px;
  height: 50px;
  text-align: center;
  min-width: 160px;
  align-items: center;
  justify-content: center;
  background-color: ${props =>
    props.isSelected ? props.theme.colors.secondary : props.theme.colors.onSurfaceDisabled};
`
const LocalText = styled.Text`
  font-size: 18px;
  font-family: ${props => props.theme.legacy.fonts.native.decorativeFontBold};
  text-transform: uppercase;
  color: ${props => props.theme.colors.background};
`
const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
`

const StyledIcon = styled(Icon)`
  width: 160px;
  height: 50px;
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
          <StyledPressable onPress={selectLocalNews} role='button' accessibilityLabel={t('local')}>
            <LocalTabWrapper isSelected={selectedNewsType === LOCAL_NEWS_TYPE}>
              <LocalText>{t('local')}</LocalText>
            </LocalTabWrapper>
          </StyledPressable>
          <StyledPressable onPress={selectTuNews} role='button' accessibilityLabel='TüNews'>
            <StyledIcon Icon={selectedNewsType === TU_NEWS_TYPE ? TuNewsActiveIcon : TuNewsInactiveIcon} />
          </StyledPressable>
        </HeaderContainer>
      )}
    </>
  )
}

export default memo(NewsHeader)
