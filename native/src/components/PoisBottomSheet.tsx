import BottomSheet, { BottomSheetFlatList, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import React, { memo, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { LocationType } from 'shared'
import { ErrorCode, PoiModel } from 'shared/api'

import dimensions from '../constants/dimensions'
import useCityAppContext from '../hooks/useCityAppContext'
import BottomSheetHandle from './BottomSheetHandle'
import Failure from './Failure'
import { NoItemsMessage } from './List'
import PoiDetails from './PoiDetails'
import PoiListItem from './PoiListItem'

const StyledBottomSheet = styled(BottomSheet)<{ isFullscreen: boolean }>`
  ${props => props.isFullscreen && `background-color: ${props.theme.colors.backgroundColor};`}
`

const BottomSheetContent = styled.View`
  flex: 1;
  margin: 0 24px;
`

const titleHeight = 20

const Title = styled.Text`
  height: ${titleHeight};
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
  font-size: 18px;
  font-weight: bold;
`

type PoiBottomSheetProps = {
  pois: PoiModel[]
  poi: PoiModel | undefined
  userLocation: LocationType | null
  slug: string | undefined
  selectPoi: (poi: PoiModel, index: number) => void
  deselectAll: () => void
  snapPoints: number[]
  snapPointIndex: number
  setSnapPointIndex: (index: number) => void
  initialScrollIndex: number
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
  initialScrollIndex,
}: PoiBottomSheetProps): ReactElement | null => {
  const { languageCode } = useCityAppContext()
  const { t } = useTranslation('pois')
  const fullscreen = snapPointIndex === snapPoints.length - 1
  // ios has scrolling issues if content panning gesture is not enabled
  const enableContentPanningGesture = Platform.OS === 'ios' || !fullscreen

  const PoiDetail = poi ? (
    <PoiDetails language={languageCode} poi={poi} distance={userLocation && poi.distance(userLocation)} />
  ) : (
    <Failure code={ErrorCode.PageNotFound} buttonAction={deselectAll} buttonLabel={t('detailsHeader')} />
  )

  const renderPoiListItem = ({ item: poi, index }: { item: PoiModel; index: number }): ReactElement => (
    <PoiListItem
      key={poi.path}
      poi={poi}
      language={languageCode}
      navigateToPoi={() => selectPoi(poi, index)}
      distance={userLocation && poi.distance(userLocation)}
    />
  )

  return (
    <StyledBottomSheet
      index={snapPointIndex}
      isFullscreen={fullscreen}
      snapPoints={snapPoints}
      enableContentPanningGesture={enableContentPanningGesture}
      enableDynamicSizing={false}
      animateOnMount
      handleComponent={BottomSheetHandle}
      onChange={setSnapPointIndex}>
      <BottomSheetContent>
        {slug ? (
          <BottomSheetScrollView>{PoiDetail}</BottomSheetScrollView>
        ) : (
          <BottomSheetFlatList
            data={pois}
            role='list'
            renderItem={renderPoiListItem}
            initialScrollIndex={initialScrollIndex}
            showsVerticalScrollIndicator={false}
            getItemLayout={(_, index) => ({
              length: dimensions.poiListItemHeight,
              offset: dimensions.poiListItemHeight * index + titleHeight - 1,
              index,
            })}
            ListHeaderComponent={<Title>{t('listTitle')}</Title>}
            ListEmptyComponent={<NoItemsMessage>{t('noPois')}</NoItemsMessage>}
          />
        )}
      </BottomSheetContent>
    </StyledBottomSheet>
  )
}

export default memo(PoisBottomSheet)
