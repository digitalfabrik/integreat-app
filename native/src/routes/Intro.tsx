import React, { ReactElement, useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, useWindowDimensions, ViewToken } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { IntroRouteType, LANDING_ROUTE } from 'api-client'

import SlideContent, { SlideContentType } from '../components/SlideContent'
import SlideFooter from '../components/SlideFooter'
import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import buildConfig, { buildConfigAssets } from '../constants/buildConfig'
import navigateToDeepLink from '../navigation/navigateToDeepLink'
import { StateType } from '../redux/StateType'
import { appSettings } from '../utils/AppSettings'

const Container = styled.View<{ width: number }>`
  flex: 1;
  flex-direction: column;
  width: ${props => props.width}px;
  justify-content: space-between;
`
const AppIcon = styled.Image`
  align-self: center;
  flex: 1;
  height: 40%;
  width: 40%;
  resize-mode: contain;
`
const ImageContent = styled.Image`
  align-self: center;
  flex: 1;
  height: 100%;
  width: 60%;
  resize-mode: contain;
`

type PropsType = {
  route: RoutePropType<IntroRouteType>
  navigation: NavigationPropType<IntroRouteType>
}

const Intro = ({ route, navigation }: PropsType): ReactElement => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const language = useSelector<StateType, string>((state: StateType) => state.contentLanguage)
  const { width } = useWindowDimensions()
  const { t } = useTranslation<['intro', 'settings']>(['intro', 'settings'])
  const theme = useTheme()
  const dispatch = useDispatch()
  const flatListRef = useRef<FlatList>(null)
  const { deepLink } = route.params

  const renderAppIcon = (): React.ReactNode => <AppIcon source={buildConfigAssets().appIcon} />
  const renderImageContent = (image: number) => (): React.ReactNode => <ImageContent source={image} />

  const icons = buildConfigAssets().intro
  const slides = icons
    ? [
        {
          key: 'integreat',
          title: buildConfig().appName,
          description: t('appDescription', {
            appName: buildConfig().appName
          }),
          renderContent: renderAppIcon
        },
        {
          key: 'search',
          title: t('search'),
          description: t('searchDescription'),
          renderContent: renderImageContent(icons.search)
        },
        {
          key: 'events',
          title: t('events'),
          description: t('eventsDescription'),
          renderContent: renderImageContent(icons.events)
        },
        {
          key: 'offers',
          title: t('offers'),
          description: t('offersDescription'),
          renderContent: renderImageContent(icons.offers)
        },
        {
          key: 'languageChange',
          title: t('languageChange'),
          description: t('languageChangeDescription'),
          renderContent: renderImageContent(icons.language)
        }
      ]
    : [
        {
          key: 'integreat',
          title: buildConfig().appName,
          description: t('appDescription', {
            appName: buildConfig().appName
          }),
          renderContent: renderAppIcon
        }
      ]

  const onDone = useCallback(async () => {
    try {
      await appSettings.setIntroShown()

      if (deepLink) {
        navigateToDeepLink(dispatch, navigation, deepLink, language)
      } else {
        navigation.replace(LANDING_ROUTE)
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(e)
    }
  }, [dispatch, language, navigation, deepLink])

  const goToSlide = useCallback((index: number) => {
    flatListRef.current?.scrollToIndex({
      index
    })
  }, [])

  const renderSlide = ({ item }: { item: SlideContentType }) => <SlideContent item={item} theme={theme} width={width} />

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
    const viewableItem = viewableItems[0]
    if (viewableItem) {
      if (viewableItem.index !== null) {
        setCurrentSlide(viewableItem.index)
      }
    }
  }, [])

  return (
    <Container width={width}>
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        viewabilityConfig={{
          itemVisiblePercentThreshold: 51,
          minimumViewTime: 0.1
        }}
        onViewableItemsChanged={onViewableItemsChanged}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        renderItem={renderSlide}
      />
      <SlideFooter
        slideCount={slides.length}
        onDone={onDone}
        currentSlide={currentSlide}
        goToSlide={goToSlide}
        theme={theme}
        t={t}
      />
    </Container>
  )
}

export default Intro
