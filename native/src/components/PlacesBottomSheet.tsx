import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetFlatListMethods,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet'
import React, { memo, ReactElement, useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { LocationType } from 'shared'
import { ErrorCode, PlaceModel } from 'shared/api'

import useAppStateListener from '../hooks/useAppStateListener'
import useRegionAppContext from '../hooks/useRegionAppContext'
import { conditionalA11yProps } from '../utils/helpers'
import BottomSheetHandle from './BottomSheetHandle'
import Failure from './Failure'
import PlaceDetails from './PlaceDetails'
import PlaceListItem from './PlaceListItem'
import Text from './base/Text'

const SCROLL_OFFSET = 0.5

const StyledBottomSheet = styled(BottomSheet)<{ isFullscreen: boolean }>`
  ${props => props.isFullscreen && `background-color: ${props.theme.colors.background};`}
`

const BottomSheetContent = styled.View`
  flex: 1;
  margin: 0 24px;
`

const PlaceDetailsOverlay = styled.View`
  position: absolute;
  inset: 0;
  background-color: ${props => props.theme.colors.background};
`

const PlaceListDivider = () => {
  // This is an alternative to <Divider/> because it has render issues inside BottomSheetFlatList
  const theme = useTheme()
  return (
    <View
      style={{
        height: 1,
        backgroundColor: theme.colors.outlineVariant,
        marginHorizontal: 16,
      }}
    />
  )
}

type PlaceBottomSheetProps = {
  refresh: () => void
  places: PlaceModel[]
  place: PlaceModel | undefined
  userLocation: LocationType | null
  slug: string | undefined
  selectPlace: (place: PlaceModel) => void
  deselectAll: () => void
  snapPoints: number[]
  snapPointIndex: number
  setSnapPointIndex: (index: number) => void
  isFullscreen: boolean
  zoomInFocusTarget?: number
}

const PlacesBottomSheet = ({
  refresh,
  places,
  place,
  userLocation,
  slug,
  selectPlace,
  deselectAll,
  snapPoints,
  snapPointIndex,
  setSnapPointIndex,
  isFullscreen,
  zoomInFocusTarget,
}: PlaceBottomSheetProps): ReactElement | null => {
  const [remountKey, setRemountKey] = useState(0)
  const { languageCode } = useRegionAppContext()
  const bottomSheetRef = useRef<BottomSheet>(null)
  const flatListRef = useRef<BottomSheetFlatListMethods>(null)
  const { t } = useTranslation('places')
  const theme = useTheme()

  // Workaround for bottomSheet gets hidden after permissions dialog on Android so we force remounting after app comes back to foreground.
  // reanimated's shared values gets affected by the permissions dialog (UI thread is stopped when the permission dialog is displayed).
  // For more details https://github.com/digitalfabrik/integreat-app/issues/4037 and https://github.com/gorhom/react-native-bottom-sheet/issues/1791#issuecomment-2060957019
  useAppStateListener(nextAppState => {
    if (nextAppState === 'active') {
      setRemountKey(1)
    }
  })

  const expandFullscreen = () => bottomSheetRef.current?.snapToIndex(snapPoints.length - 1)

  const handlePlaceSelection = (place: PlaceModel) => {
    selectPlace(place)
    bottomSheetRef.current?.snapToIndex(1)
    const index = places.findIndex(it => it.path === place.path)
    if (index !== -1) {
      flatListRef.current?.scrollToIndex({
        index: Math.max(0, Math.round(index - SCROLL_OFFSET)),
        animated: false,
      })
    }
  }

  const HandleComponent = useCallback(
    () => <BottomSheetHandle nextFocusForward={zoomInFocusTarget} />,
    [zoomInFocusTarget],
  )

  const PlaceDetail = place ? (
    <PlaceDetails
      onFocus={expandFullscreen}
      language={languageCode}
      place={place}
      distance={userLocation && place.distance(userLocation)}
    />
  ) : (
    <Failure code={ErrorCode.PageNotFound} retry={refresh} goTo={deselectAll} goToLabel={t('backToOverview')} />
  )

  const renderPlaceListItem = ({ item: place }: { item: PlaceModel }): ReactElement => (
    <PlaceListItem
      key={place.path}
      place={place}
      language={languageCode}
      navigateToPlace={() => handlePlaceSelection(place)}
      distance={userLocation && place.distance(userLocation)}
      onFocus={expandFullscreen}
      visible={!slug}
    />
  )

  return (
    <StyledBottomSheet
      key={remountKey}
      ref={bottomSheetRef}
      accessible={false}
      index={snapPointIndex}
      isFullscreen={isFullscreen}
      snapPoints={snapPoints}
      enableContentPanningGesture
      enableDynamicSizing={false}
      animateOnMount
      backgroundStyle={{ backgroundColor: theme.colors.background }}
      handleComponent={HandleComponent}
      onChange={setSnapPointIndex}>
      <BottomSheetContent>
        <BottomSheetFlatList
          onScrollToIndexFailed={() => {}}
          ref={flatListRef}
          data={places}
          role='list'
          {...conditionalA11yProps({ hidden: !!slug })}
          accessibilityLabel={t('placesCount', { count: places.length })}
          keyExtractor={(item: PoiModel) => item.path}
          renderItem={renderPlaceListItem}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={<Text variant='h5'>{t('common:nearby')}</Text>}
          ListEmptyComponent={
            <Text
              variant='body2'
              style={{
                alignSelf: 'center',
                marginTop: 20,
              }}>
              {t('noPlaces')}
            </Text>
          }
          ItemSeparatorComponent={PlaceListDivider}
        />
        {slug && (
          <PlaceDetailsOverlay>
            <BottomSheetScrollView showsVerticalScrollIndicator={false}>{PlaceDetail}</BottomSheetScrollView>
          </PlaceDetailsOverlay>
        )}
      </BottomSheetContent>
    </StyledBottomSheet>
  )
}

export default memo(PlacesBottomSheet)
