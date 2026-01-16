import React, { memo, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import { LOCAL_NEWS_TYPE, NewsType, TU_NEWS_TYPE } from 'shared'
import { CityModel } from 'shared/api'

import { TuNewsActiveIcon, TuNewsInactiveIcon } from '../assets'
import Caption from './Caption'
import Icon from './base/Icon'
import Text from './base/Text'

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

const styles = StyleSheet.create({
  TouchableRippleStyle: {
    marginHorizontal: 10,
    marginBottom: 5,
    alignItems: 'center',
  },
})

type NewsHeaderProps = {
  cityModel: CityModel
  selectedNewsType: NewsType
  selectNewsType: (newsType: NewsType) => void
}

const NewsHeader = ({ cityModel, selectedNewsType, selectNewsType }: NewsHeaderProps): ReactElement => {
  const { t } = useTranslation('news')
  const theme = useTheme()
  const selectLocalNews = () => selectNewsType(LOCAL_NEWS_TYPE)
  const selectTuNews = () => selectNewsType(TU_NEWS_TYPE)

  return (
    <>
      <Caption title={t('news')} />
      {cityModel.localNewsEnabled && cityModel.tunewsEnabled && (
        <HeaderContainer>
          <TouchableRipple
            borderless
            onPress={selectLocalNews}
            role='button'
            accessibilityLabel={t('local')}
            style={styles.TouchableRippleStyle}>
            <LocalTabWrapper isSelected={selectedNewsType === LOCAL_NEWS_TYPE}>
              <Text variant='h5' style={{ textTransform: 'uppercase', color: theme.colors.background }}>
                {t('local')}
              </Text>
            </LocalTabWrapper>
          </TouchableRipple>
          <TouchableRipple
            borderless
            onPress={selectTuNews}
            role='button'
            accessibilityLabel='TüNews'
            style={styles.TouchableRippleStyle}>
            <StyledIcon Icon={selectedNewsType === TU_NEWS_TYPE ? TuNewsActiveIcon : TuNewsInactiveIcon} />
          </TouchableRipple>
        </HeaderContainer>
      )}
    </>
  )
}

export default memo(NewsHeader)
