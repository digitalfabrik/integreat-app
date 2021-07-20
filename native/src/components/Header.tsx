import React, { ReactElement } from 'react'
import { Share } from 'react-native'
import styled from 'styled-components/native'
import { Item } from 'react-navigation-header-buttons'
import { HeaderBackButton, StackHeaderProps } from '@react-navigation/stack'
import { TFunction } from 'react-i18next'
import { CityModel, SHARE_SIGNAL_NAME } from 'api-client'
import MaterialHeaderButtons from './MaterialHeaderButtons'
import buildConfig, { buildConfigAssets } from '../constants/buildConfig'
import dimensions from '../constants/dimensions'
import { StoreActionType } from '../redux/StoreActionType'
import { Dispatch } from 'redux'
import { DISCLAIMER_ROUTE, SEARCH_ROUTE, SETTINGS_ROUTE } from 'api-client/src/routes'
import navigateToLanding from '../navigation/navigateToLanding'
import sendTrackingSignal from '../services/sendTrackingSignal'
import { ThemeType } from 'build-configs'

const Horizontal = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`
const HorizontalLeft = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`
const Icon = styled.Image`
  width: 70px;
  height: 50px;
  resize-mode: contain;
`
const HeaderText = styled.Text`
  flex: 1;
  flex-direction: column;
  font-size: 20px;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
`
const BoxShadow = styled.View`
  elevation: 1;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.18;
  shadow-radius: 1px;
  background-color: ${props => props.theme.colors.backgroundAccentColor};
  height: ${dimensions.headerHeight}px;
`

export type PropsType = StackHeaderProps & {
  t: TFunction
  theme: ThemeType
  peeking: boolean
  categoriesAvailable: boolean
  goToLanguageChange?: () => void
  routeCityModel?: CityModel
  language: string
  shareUrl: string | null | undefined
  dispatch: Dispatch<StoreActionType>
}

enum HeaderButtonTitle {
  Disclaimer = 'disclaimer',
  Language = 'changeLanguage',
  Location = 'changeLocation',
  Search = 'search',
  Share = 'share',
  Settings = 'settings'
}

const Header = (props: PropsType): ReactElement => {
  const {
    navigation,
    dispatch,
    shareUrl,
    language,
    t,
    routeCityModel,
    theme,
    goToLanguageChange,
    peeking,
    categoriesAvailable
  } = props

  const canGoBackInStack = (): boolean => {
    return !!props.previous
  }

  const goBackInStack = () => {
    navigation.goBack()
  }

  const goToLanding = () => {
    navigateToLanding({
      dispatch,
      // @ts-ignore Navigation type of the header does not match that of screens.
      navigation
    })
  }

  const goToSettings = () => {
    navigation.navigate(SETTINGS_ROUTE)
  }

  const onShare = async () => {
    if (!shareUrl) {
      // The share option should only be shown if there is a shareUrl
      return
    }

    const message = t('shareMessage', {
      message: shareUrl,
      interpolation: {
        escapeValue: false
      }
    })
    sendTrackingSignal({
      signal: {
        name: SHARE_SIGNAL_NAME,
        url: shareUrl
      }
    })

    try {
      await Share.share({
        message,
        title: buildConfig().appName
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  const goToSearch = () => {
    navigation.navigate(SEARCH_ROUTE)
  }

  const goToDisclaimer = () => {
    if (!routeCityModel) {
      throw new Error('Impossible to go to disclaimer route if no city model is defined')
    }

    const cityCode = routeCityModel.code
    navigation.navigate(DISCLAIMER_ROUTE, {
      cityCode,
      languageCode: language
    })
  }

  const cityDisplayName = () => {
    if (!routeCityModel) {
      return ''
    }

    const description = routeCityModel.prefix ? ` (${routeCityModel.prefix})` : ''
    return `${routeCityModel.sortingName}${description}`
  }

  const renderItem = (
    title: string,
    show: boolean,
    onPress?: () => void,
    iconName?: string,
    visible = true
  ): ReactElement => {
    return (
      <Item
        disabled={!visible}
        title={title}
        accessibilityLabel={t(title)}
        iconName={iconName || undefined}
        show={show ? 'always' : 'never'}
        onPress={onPress}
        style={{ opacity: visible ? 1 : 0 }}
      />
    )
  }

  const showShare = !!shareUrl
  const showChangeLocation = !buildConfig().featureFlags.fixedCity
  return (
    <BoxShadow theme={theme}>
      <Horizontal>
        <HorizontalLeft>
          {canGoBackInStack() ? (
            <HeaderBackButton onPress={goBackInStack} labelVisible={false} />
          ) : (
            <Icon source={buildConfigAssets().appIcon} />
          )}
          {routeCityModel && (
            <HeaderText allowFontScaling={false} theme={theme}>
              {cityDisplayName()}
            </HeaderText>
          )}
        </HorizontalLeft>
        <MaterialHeaderButtons cancelLabel={t('cancel')} theme={theme}>
          {renderItem(HeaderButtonTitle.Search, true, goToSearch, 'search', !peeking && categoriesAvailable)}
          {renderItem(
            HeaderButtonTitle.Language,
            true,
            goToLanguageChange,
            'language',
            !peeking && !!goToLanguageChange
          )}
          {showShare && renderItem(HeaderButtonTitle.Share, false, onShare)}
          {showChangeLocation && renderItem(HeaderButtonTitle.Location, false, goToLanding)}
          {renderItem(HeaderButtonTitle.Settings, false, goToSettings)}
          {routeCityModel && renderItem(HeaderButtonTitle.Disclaimer, false, goToDisclaimer)}
        </MaterialHeaderButtons>
      </Horizontal>
    </BoxShadow>
  )
}

export default Header
