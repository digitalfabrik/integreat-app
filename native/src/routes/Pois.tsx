import { BottomSheetFlatListMethods } from '@gorhom/bottom-sheet'
import React, { ReactElement, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, useWindowDimensions } from 'react-native'
import { Chip } from 'react-native-paper'
import { SvgUri } from 'react-native-svg'
import styled from 'styled-components/native'

import { isMultipoi, LocationType, MapFeature, preparePois, safeParseInt, sortPois } from 'shared'
import { PoiCategoryModel, CityModel, PoiModel } from 'shared/api'

import { EditLocationIcon } from '../assets'
import MapView from '../components/MapView'
import PoiFiltersModal from '../components/PoiFiltersModal'
import PoisBottomSheet from '../components/PoisBottomSheet'
import Icon from '../components/base/Icon'
import Text from '../components/base/Text'
import dimensions from '../constants/dimensions'
import { UseLocalHistoryReturn } from '../hooks/useLocalStackHistory'
import { PoiHistory } from './PoisContainer'

const StyledSvgUri = styled(SvgUri)`
  color: ${props => props.theme.colors.onSurface};
  margin-inline-start: 4px;
`

const Container = styled.View`
  flex: 1;
`

const SNAP_POINT_MID_PERCENTAGE = 0.35

type PoisProps = {
  localHistory: UseLocalHistoryReturn<PoiHistory>
  pois: PoiModel[]
  cityModel: CityModel
  initialZoom: number | undefined
}

const Pois = ({ localHistory, initialZoom, pois: allPois, cityModel }: PoisProps): ReactElement => {
  const [userLocation, setUserLocation] = useState<LocationType | null>(null)
  const [bottomSheetSnapPointIndex, setBottomSheetSnapPointIndex] = useState(1)
  const poiListRef = useRef<BottomSheetFlatListMethods>(null)
  const { height } = useWindowDimensions()
  const { t } = useTranslation('pois')

  const { slug, multipoi, poiCategoryId, currentlyOpen, showFilterSelection } = localHistory.current
  const { pois, poi, mapFeatures, mapFeature, poiCategories, poiCategory } = preparePois({
    pois: allPois,
    params: { slug, multipoi, poiCategoryId, currentlyOpen },
  })

  const bottomSheetSnapPoints = [dimensions.bottomSheetHandle.height, SNAP_POINT_MID_PERCENTAGE * height, height]
  const bottomSheetFullscreen = bottomSheetSnapPointIndex === bottomSheetSnapPoints.length - 1
  const bottomSheetHeight = bottomSheetSnapPoints[bottomSheetSnapPointIndex] ?? 0

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

  const styles = StyleSheet.create({
    chip: {
      borderColor: 'transparent',
      borderRadius: 24,
      height: 32,
      marginRight: 4,
    },
  })

  const FiltersOverlayButtons = (
    <>
      <Chip
        mode='outlined'
        rippleColor='transparent'
        style={styles.chip}
        elevated
        avatar={<Icon Icon={EditLocationIcon} />}
        onPress={() => updateShowFilterSelection(true)}>
        <Text variant='body3'>{t('adjustFilters')}</Text>
      </Chip>

      {currentlyOpen && (
        <Chip
          mode='outlined'
          rippleColor='transparent'
          style={styles.chip}
          avatar={<Icon source='clock-outline' size={20} style={{ width: 20, height: 20 }} />}
          onPress={() => updatePoiCurrentlyOpenFilter(false)}
          onClose={() => updatePoiCurrentlyOpenFilter(false)}
          closeIcon='close'>
          <Text variant='body3'>{t('opened')}</Text>
        </Chip>
      )}
      {!!poiCategory && (
        <Chip
          mode='outlined'
          rippleColor='transparent'
          style={styles.chip}
          avatar={<StyledSvgUri uri={poiCategory.icon} />}
          onPress={() => updatePoiCategoryFilter(null)}
          onClose={() => updatePoiCategoryFilter(null)}
          closeIcon='close'>
          <Text variant='body3'>{poiCategory.name}</Text>
        </Chip>
      )}
    </>
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
        boundingBox={cityModel.boundingBox}
        features={mapFeatures}
        selectedFeature={mapFeature ?? null}
        bottomSheetHeight={bottomSheetHeight}
        bottomSheetFullscreen={bottomSheetFullscreen}
        setUserLocation={setUserLocation}
        userLocation={userLocation}
        zoom={initialZoom}
        Overlay={FiltersOverlayButtons}
      />
      <PoisBottomSheet
        poiListRef={poiListRef}
        pois={sortPois(pois, userLocation)}
        poi={poi}
        slug={slug}
        userLocation={userLocation}
        selectPoi={selectPoi}
        deselectAll={deselect}
        snapPoints={bottomSheetSnapPoints}
        snapPointIndex={bottomSheetSnapPointIndex}
        setSnapPointIndex={setBottomSheetSnapPointIndex}
        setScrollPosition={() => undefined}
        isFullscreen={bottomSheetFullscreen}
      />
    </Container>
  )
}

export default Pois
