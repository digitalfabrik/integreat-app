import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetFlatListMethods,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet'
import React, { memo, ReactElement, Ref, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { NativeScrollEvent, NativeSyntheticEvent, Platform, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { LocationType } from 'shared'
import { ErrorCode, PoiModel } from 'shared/api'

import useCityAppContext from '../hooks/useCityAppContext'
import BottomSheetHandle from './BottomSheetHandle'
import Failure from './Failure'
import PoiDetails from './PoiDetails'
import PoiListItem from './PoiListItem'
import Text from './base/Text'

const StyledBottomSheet = styled(BottomSheet)<{ isFullscreen: boolean }>`
  ${props => props.isFullscreen && `background-color: ${props.theme.colors.background};`}
`

const BottomSheetContent = styled.View`
  flex: 1;
  margin: 0 24px;
`

const PoiListDivider = () => {
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

type PoiBottomSheetProps = {
  poiListRef: Ref<BottomSheetFlatListMethods>
  pois: PoiModel[]
  poi: PoiModel | undefined
  userLocation: LocationType | null
  slug: string | undefined
  selectPoi: (poi: PoiModel) => void
  deselectAll: () => void
  snapPoints: number[]
  snapPointIndex: number
  setSnapPointIndex: (index: number) => void
  setScrollPosition: (position: number) => void
  isFullscreen: boolean
}

const PoisBottomSheet = ({
  poiListRef,
  pois,
  poi,
  userLocation,
  slug,
  selectPoi,
  deselectAll,
  snapPoints,
  snapPointIndex,
  setSnapPointIndex,
  setScrollPosition,
  isFullscreen,
}: PoiBottomSheetProps): ReactElement | null => {
  const { languageCode } = useCityAppContext()
  const { t } = useTranslation('pois')
  const theme = useTheme()
  const bottomSheetRef = useRef<BottomSheet>(null)
  // ios has scrolling issues if content panning gesture is not enabled
  const enableContentPanningGesture = Platform.OS === 'ios' || !isFullscreen

  const handlePoiFocus = useCallback(() => {
    if (!isFullscreen && bottomSheetRef.current) {
      const fullscreenIndex = snapPoints.length - 1
      bottomSheetRef.current.snapToIndex(fullscreenIndex)
    }
  }, [isFullscreen, snapPoints.length])

  const handlePoiSelection = (poi: PoiModel) => {
    selectPoi(poi)
    bottomSheetRef.current?.snapToIndex(1)
  }

  const PoiDetail = poi ? (
    <PoiDetails
      onFocus={handlePoiFocus}
      language={languageCode}
      poi={poi}
      distance={userLocation && poi.distance(userLocation)}
    />
  ) : (
    <Failure code={ErrorCode.PageNotFound} buttonAction={deselectAll} buttonLabel={t('backToOverview')} />
  )

  const renderPoiListItem = ({ item: poi }: { item: PoiModel }): ReactElement => (
    <PoiListItem
      key={poi.path}
      poi={poi}
      language={languageCode}
      navigateToPoi={() => handlePoiSelection(poi)}
      distance={userLocation && poi.distance(userLocation)}
      onFocus={handlePoiFocus}
    />
  )

  return (
    <StyledBottomSheet
      ref={bottomSheetRef}
      accessibilityLabel=''
      index={snapPointIndex}
      isFullscreen={isFullscreen}
      snapPoints={snapPoints}
      enableContentPanningGesture={enableContentPanningGesture}
      enableDynamicSizing={false}
      animateOnMount
      backgroundStyle={{ backgroundColor: theme.colors.background }}
      handleComponent={BottomSheetHandle}
      onChange={setSnapPointIndex}>
      <BottomSheetContent>
        {slug ? (
          <BottomSheetScrollView showsVerticalScrollIndicator={false}>{PoiDetail}</BottomSheetScrollView>
        ) : (
          <BottomSheetFlatList
            ref={poiListRef}
            data={pois}
            role='list'
            accessibilityLabel={t('poisCount', { count: pois.length })}
            renderItem={renderPoiListItem}
            onMomentumScrollBegin={(event: NativeSyntheticEvent<NativeScrollEvent>) =>
              setScrollPosition(event.nativeEvent.contentOffset.y)
            }
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={<Text variant='h5'>{t('common:nearby')}</Text>}
            ListEmptyComponent={
              <Text
                variant='body2'
                style={{
                  alignSelf: 'center',
                  marginTop: 20,
                }}>
                {t('noPois')}
              </Text>
            }
            ItemSeparatorComponent={PoiListDivider}
          />
        )}
      </BottomSheetContent>
    </StyledBottomSheet>
  )
}

export default memo(PoisBottomSheet)
