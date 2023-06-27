import React, { ReactElement, useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, useWindowDimensions, ViewToken } from 'react-native'
import { useTheme } from 'styled-components'
import styled, { css } from 'styled-components/native'

import { IntroRouteType, LANDING_ROUTE } from 'api-client'

import SlideContent, { SlideContentType } from '../components/SlideContent'
import SlideFooter from '../components/SlideFooter'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import buildConfig, { buildConfigAssets } from '../constants/buildConfig'
import useNavigateToDeepLink from '../hooks/useNavigateToDeepLink'
import appSettings from '../utils/AppSettings'
import { reportError } from '../utils/sentry'

const Container = styled.View<{ width: number }>`
  flex: 1;
  flex-direction: column;
  width: ${props => props.width}px;
  justify-content: space-between;
`

const ImageStyle = css`
  align-self: center;
  flex: 1;
`
const icons = buildConfigAssets().intro
const styledIcons = icons
  ? {
      Search: styled(icons.Search)`
        ${ImageStyle}
      `,
      Events: styled(icons.Events)`
        ${ImageStyle}
      `,
      Offers: styled(icons.Offers)`
        ${ImageStyle}
      `,
      Language: styled(icons.Language)`
        ${ImageStyle}
      `,
    }
  : null
const AppIcon = styled(buildConfigAssets().AppIcon)`
  ${ImageStyle}
`

type IntroProps = {
  route: RouteProps<IntroRouteType>
  navigation: NavigationProps<IntroRouteType>
}

const Intro = ({ route, navigation }: IntroProps): ReactElement => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { width } = useWindowDimensions()
  const { t } = useTranslation<['intro', 'settings']>(['intro', 'settings'])
  const theme = useTheme()
  const flatListRef = useRef<FlatList>(null)
  const { deepLink } = route.params
  const navigateToDeepLink = useNavigateToDeepLink()

  const slides = [
    {
      key: 'integreat',
      title: buildConfig().appName,
      description: t('appDescription', {
        appName: buildConfig().appName,
      }),
      Content: <AppIcon width='40%' height='40%' />,
    },
  ]
  if (styledIcons) {
    slides.push(
      {
        key: 'search',
        title: t('search'),
        description: t('searchDescription'),
        Content: <styledIcons.Search height='100%' width='60%' />,
      },
      {
        key: 'events',
        title: t('events'),
        description: t('eventsDescription'),
        Content: <styledIcons.Events height='100%' width='60%' />,
      },
      {
        key: 'offers',
        title: t('offers'),
        description: t('offersDescription'),
        Content: <styledIcons.Offers height='100%' width='60%' />,
      },
      {
        key: 'languageChange',
        title: t('languageChange'),
        description: t('languageChangeDescription'),
        Content: <styledIcons.Language height='100%' width='60%' />,
      }
    )
  }

  const onDone = useCallback(async () => {
    try {
      await appSettings.setIntroShown()

      if (deepLink) {
        navigateToDeepLink(deepLink)
      } else {
        navigation.replace(LANDING_ROUTE)
      }
    } catch (e) {
      reportError(e)
    }
  }, [navigateToDeepLink, navigation, deepLink])

  const goToSlide = useCallback((index: number) => {
    flatListRef.current?.scrollToIndex({
      index,
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
          minimumViewTime: 0.1,
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
