import React, { ReactElement, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { findNodeHandle, useWindowDimensions, type View } from 'react-native'
import { Chip } from 'react-native-paper'
import { SvgUri } from 'react-native-svg'
import styled from 'styled-components/native'

import { isMultipoi, MapFeature, preparePois, safeParseInt, sortPois } from 'shared'
import { PoiCategoryModel, PoiModel, RegionModel } from 'shared/api'

import { EditLocationIcon } from '../assets'
import MapView from '../components/MapView'
import PoiFiltersModal from '../components/PoiFiltersModal'
import PoisBottomSheet from '../components/PoisBottomSheet'
import Icon from '../components/base/Icon'
import Text from '../components/base/Text'
import dimensions from '../constants/dimensions'
import { UseLocalHistoryReturn } from '../hooks/useLocalStackHistory'
import useUserLocation from '../hooks/useUserLocation'

const StyledSvgUri = styled(SvgUri)`
  color: ${props => props.theme.colors.onSurface};
  margin-inline-start: 4px;
`

const Container = styled.View`
  flex: 1;
`

const ChipContainer = styled.View({
  flexDirection: 'row',
  gap: 4,
})

const StyledChip = styled(Chip)({
  borderColor: 'transparent',
  borderRadius: 24,
  height: 32,
})

const SNAP_POINT_MID_PERCENTAGE = 0.35

export type PoiHistory = {
  slug: string | undefined
  multipoi: number | undefined
  poiCategoryId: number | undefined
  currentlyOpen: boolean
  showFilterSelection: boolean
}

type PoisProps = {
  refresh: () => void
  localHistory: UseLocalHistoryReturn<PoiHistory>
  pois: PoiModel[]
  regionModel: RegionModel
  initialZoom: number | undefined
}

const Pois = ({ refresh, localHistory, initialZoom, pois: allPois, regionModel }: PoisProps): ReactElement => {
  const { slug, multipoi, poiCategoryId, currentlyOpen, showFilterSelection } = localHistory.current
  const [bottomSheetSnapPointIndex, setBottomSheetSnapPointIndex] = useState(1)
  const [zoomInFocusTarget, setZoomInFocusTarget] = useState<number | undefined>(undefined)
  const { userLocation, refreshPermissionAndLocation } = useUserLocation({ requestPermissionInitially: false })
  const { t } = useTranslation('pois')
  const { height } = useWindowDimensions()
  const bottomSheetSnapPoints = [dimensions.bottomSheetHandle.height, SNAP_POINT_MID_PERCENTAGE * height, height]
  const bottomSheetMidHeight = SNAP_POINT_MID_PERCENTAGE * height
  const bottomSheetFullscreen = bottomSheetSnapPointIndex === bottomSheetSnapPoints.length - 1
  const bottomSheetHeight = bottomSheetSnapPoints[bottomSheetSnapPointIndex] ?? 0

  const { pois, poi, mapFeatures, mapFeature, poiCategories, poiCategory } = preparePois({
    pois: allPois,
    params: { slug, multipoi, poiCategoryId, currentlyOpen },
  })

  const handleZoomInRef = useCallback((view: View | null) => {
    setZoomInFocusTarget(findNodeHandle(view) ?? undefined)
  }, [])

  const deselect = () => localHistory.push(multipoi !== undefined && slug ? { multipoi } : {})

  const updateShowFilterSelection = (showFilterSelection: boolean) => localHistory.push({ showFilterSelection })

  const updatePoiCategoryFilter = (poiCategory: PoiCategoryModel | null) =>
    localHistory.pushReset({ poiCategoryId: poiCategory?.id, currentlyOpen })

  const updatePoiCurrentlyOpenFilter = (currentlyOpen: boolean) =>
    localHistory.pushReset({ poiCategoryId, currentlyOpen })

  const selectMapFeature = (mapFeature: MapFeature | null) => {
    setBottomSheetSnapPointIndex(1)

    const slug = mapFeature?.properties.pois[0]?.slug
    if (mapFeature && isMultipoi(mapFeature)) {
      localHistory.push({ multipoi: safeParseInt(mapFeature.id), slug: undefined })
    } else if (slug || localHistory.current.slug) {
      localHistory.push({ multipoi: undefined, slug })
    }
  }

  const selectPoi = (poi: PoiModel) => localHistory.push({ slug: poi.slug })

  const FiltersOverlayButtons = (
    <ChipContainer>
      <StyledChip
        mode='outlined'
        rippleColor='transparent'
        elevated
        avatar={<Icon Icon={EditLocationIcon} />}
        onPress={() => updateShowFilterSelection(true)}>
        <Text variant='body3'>{t('adjustFilters')}</Text>
      </StyledChip>

      {currentlyOpen && (
        <StyledChip
          mode='outlined'
          rippleColor='transparent'
          avatar={<Icon source='clock-outline' size={20} style={{ width: 20, height: 20 }} />}
          onPress={() => updatePoiCurrentlyOpenFilter(false)}
          onClose={() => updatePoiCurrentlyOpenFilter(false)}
          closeIcon='close'>
          <Text variant='body3'>{t('opened')}</Text>
        </StyledChip>
      )}
      {!!poiCategory && (
        <StyledChip
          mode='outlined'
          rippleColor='transparent'
          avatar={<StyledSvgUri uri={poiCategory.icon} />}
          onPress={() => updatePoiCategoryFilter(null)}
          onClose={() => updatePoiCategoryFilter(null)}
          closeIcon='close'>
          <Text variant='body3'>{poiCategory.name}</Text>
        </StyledChip>
      )}
    </ChipContainer>
  )

  return (
    <Container>
      <PoiFiltersModal
        modalVisible={showFilterSelection}
        closeModal={localHistory.pop}
        poiCategories={poiCategories}
        selectedPoiCategory={poiCategory}
        setSelectedPoiCategory={updatePoiCategoryFilter}
        currentlyOpenFilter={currentlyOpen}
        setCurrentlyOpenFilter={updatePoiCurrentlyOpenFilter}
        poisCount={pois.length}
      />
      <MapView
        selectFeature={selectMapFeature}
        boundingBox={regionModel.boundingBox}
        features={mapFeatures}
        selectedFeature={mapFeature ?? null}
        bottomSheetHeight={bottomSheetHeight}
        bottomSheetMidHeight={bottomSheetMidHeight}
        bottomSheetFullscreen={bottomSheetFullscreen}
        refreshPermissionAndLocation={refreshPermissionAndLocation}
        userLocation={userLocation}
        zoom={initialZoom}
        Overlay={FiltersOverlayButtons}
        zoomRef={handleZoomInRef}
      />
      <PoisBottomSheet
        refresh={refresh}
        pois={sortPois(pois, userLocation)}
        poi={poi}
        slug={slug}
        userLocation={userLocation}
        selectPoi={selectPoi}
        deselectAll={deselect}
        snapPoints={bottomSheetSnapPoints}
        snapPointIndex={bottomSheetSnapPointIndex}
        setSnapPointIndex={setBottomSheetSnapPointIndex}
        isFullscreen={bottomSheetFullscreen}
        zoomInFocusTarget={zoomInFocusTarget}
      />
    </Container>
  )
}

export default Pois
