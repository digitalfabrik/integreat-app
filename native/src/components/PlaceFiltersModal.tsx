import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SvgUri } from 'react-native-svg'
import styled from 'styled-components/native'

import { PlaceCategoryModel } from 'shared/api'

import Modal from './Modal'
import Icon from './base/Icon'
import Switch from './base/Switch'
import Text from './base/Text'
import ToggleButton from './base/ToggleButton'

const Container = styled(SafeAreaView)`
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
`

const Section = styled.View`
  padding-top: 16px;
  width: 100%;
`

const Row = styled.View`
  flex-direction: row;
  padding-top: 16px;
`
const StyledRow = styled(Row)`
  align-items: center;
  justify-content: center;
`

const FlexEnd = styled.View`
  justify-content: flex-end;
`

const TileRow = styled(Row)`
  place-content: space-between center;
  flex-wrap: wrap;
  gap: 16px;
`

const StyledToggleButton = styled(ToggleButton)`
  margin-bottom: 8px;
`

const StyledSvgUri = styled(SvgUri)<{ active: boolean }>`
  color: ${props => {
    if (props.theme.dark) {
      return props.theme.colors.onPrimary
    }
    return props.active ? props.theme.colors.primary : props.theme.colors.onSurface
  }};
`

export type PlaceFilters = {
  placeCategoryFilter: PlaceCategoryModel | undefined
  currentlyOpenFilter: boolean
}

type PlaceFiltersModalProps = PlaceFilters & {
  closeModal: (filters: PlaceFilters) => void
  placeCategories: PlaceCategoryModel[]
  getPlacesCount: (filters: PlaceFilters) => number
}

const PlaceFiltersModal = ({
  closeModal,
  placeCategories,
  placeCategoryFilter,
  currentlyOpenFilter,
  getPlacesCount,
}: PlaceFiltersModalProps): ReactElement => {
  const [tempPlaceCategory, setTempPlaceCategory] = useState(placeCategoryFilter)
  const [tempCurrentlyOpen, setTempCurrentlyOpen] = useState(currentlyOpenFilter)
  const { t } = useTranslation('places')

  const filters = { placeCategoryFilter: tempPlaceCategory, currentlyOpenFilter: tempCurrentlyOpen }
  const close = () => closeModal(filters)
  const placesCount = getPlacesCount(filters)

  return (
    <Modal closeModal={close} headerTitle='' title={t('adjustFilters')} modalVisible>
      <Container>
        <Section>
          <Row>
            <Text variant='h6'>{t('openingHours')}</Text>
          </Row>
          <StyledRow>
            <Icon source='clock-outline' />
            <Text
              variant='body2'
              style={{
                padding: 4,
                flexShrink: 1,
              }}>
              {t('onlyCurrentlyOpen')}
            </Text>
            <FlexEnd>
              {/* key is a workaround for iOS 26 where the Switch animation does not update on first click */}
              <Switch key={`${currentlyOpenFilter}`} onValueChange={setTempCurrentlyOpen} value={tempCurrentlyOpen} />
            </FlexEnd>
          </StyledRow>
        </Section>
        <Section>
          <Row>
            <Text variant='h6'>{t('placeCategories')}</Text>
            <Text
              variant='body3'
              style={{
                alignSelf: 'flex-end',
                padding: 4,
              }}>
              {t('alphabetLetters')}
            </Text>
          </Row>
          <TileRow>
            {placeCategories.map(it => (
              <StyledToggleButton
                key={it.id}
                text={it.name}
                active={it.id === tempPlaceCategory?.id}
                onPress={() => setTempPlaceCategory(it.id === tempPlaceCategory?.id ? undefined : it)}
                icon={<StyledSvgUri uri={it.icon} active={it.id === tempPlaceCategory?.id} />}
              />
            ))}
          </TileRow>
        </Section>
        <Section style={{ marginBottom: 8 }}>
          <Button onPress={close} mode='contained' disabled={placesCount === 0}>
            {t('showPlaces', { count: placesCount })}
          </Button>
        </Section>
      </Container>
    </Modal>
  )
}

export default PlaceFiltersModal
