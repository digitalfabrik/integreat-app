import BottomSheet, { BottomSheetFlatList, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import React, { memo, ReactElement, useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { LocationType } from 'shared'
import { ErrorCode, PoiModel } from 'shared/api'

import useAppStateListener from '../hooks/useAppStateListener'
import useRegionAppContext from '../hooks/useRegionAppContext'
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
  pois: PoiModel[]
  poi: PoiModel | undefined
  userLocation: LocationType | null
  slug: string | undefined
  selectPoi: (poi: PoiModel) => void
  deselectAll: () => void
  snapPoints: number[]
  snapPointIndex: number
  setSnapPointIndex: (index: number) => void
  isFullscreen: boolean
  zoomInFocusTarget?: number
}

const PoisBottomSheet = ({
  pois,
  poi,
  userLocation,
  slug,
  selectPoi,
  deselectAll,
  snapPoints,
  snapPointIndex,
  setSnapPointIndex,
  isFullscreen,
  zoomInFocusTarget,
}: PoiBottomSheetProps): ReactElement | null => {
  const [remountKey, setRemountKey] = useState(0)
  const { languageCode } = useRegionAppContext()
  const bottomSheetRef = useRef<BottomSheet>(null)
  const { t } = useTranslation('pois')
  const theme = useTheme()

  // Workaround for bottomSheet gets hidden after permissions dialog on Android so we force remounting after app comes back to foreground.
  // reanimated's shared values gets affected by the permissions dialog (UI thread is stopped when the permission dialog is displayed).
  // For more details https://github.com/digitalfabrik/integreat-app/issues/4037 and https://github.com/gorhom/react-native-bottom-sheet/issues/1791#issuecomment-2060957019
  useAppStateListener(nextAppState => {
    if (nextAppState === 'active') {
      setRemountKey(previous => previous + 1)
    }
  })

  const expandFullscreen = () => bottomSheetRef.current?.snapToIndex(snapPoints.length - 1)

  const handlePoiSelection = (poi: PoiModel) => {
    selectPoi(poi)
    bottomSheetRef.current?.snapToIndex(1)
  }

  const HandleComponent = useCallback(
    () => <BottomSheetHandle nextFocusForward={zoomInFocusTarget} />,
    [zoomInFocusTarget],
  )

  const PoiDetail = poi ? (
    <PoiDetails
      onFocus={expandFullscreen}
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
      onFocus={expandFullscreen}
    />
  )

  return (
    <StyledBottomSheet
      key={remountKey}
      ref={bottomSheetRef}
      accessibilityLabel=''
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
        {slug ? (
          <BottomSheetScrollView showsVerticalScrollIndicator={false}>{PoiDetail}</BottomSheetScrollView>
        ) : (
          <BottomSheetFlatList
            data={pois}
            role='list'
            accessibilityLabel={t('poisCount', { count: pois.length })}
            renderItem={renderPoiListItem}
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
