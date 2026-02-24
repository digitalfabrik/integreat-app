import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Switch } from 'react-native-paper'
import { SvgUri } from 'react-native-svg'
import styled from 'styled-components/native'

import { PoiCategoryModel } from 'shared/api'

import Modal from './Modal'
import Icon from './base/Icon'
import Text from './base/Text'
import ToggleButton from './base/ToggleButton'

const Container = styled.View`
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

type PoiFiltersModalProps = {
  modalVisible: boolean
  closeModal: () => void
  poiCategories: PoiCategoryModel[]
  selectedPoiCategory: PoiCategoryModel | undefined
  setSelectedPoiCategory: (poiCategory: PoiCategoryModel | null) => void
  currentlyOpenFilter: boolean
  setCurrentlyOpenFilter: (currentlyOpen: boolean) => void
  poisCount: number
}

const PoiFiltersModal = ({
  modalVisible,
  closeModal,
  poiCategories,
  selectedPoiCategory,
  setSelectedPoiCategory,
  currentlyOpenFilter,
  setCurrentlyOpenFilter,
  poisCount,
}: PoiFiltersModalProps): ReactElement => {
  const { t } = useTranslation('pois')
  return (
    <Modal modalVisible={modalVisible} closeModal={closeModal} headerTitle='' title={t('adjustFilters')}>
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
              <Switch onValueChange={setCurrentlyOpenFilter} value={currentlyOpenFilter} />
            </FlexEnd>
          </StyledRow>
        </Section>
        <Section>
          <Row>
            <Text variant='h6'>{t('poiCategories')}</Text>
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
            {poiCategories.map(it => (
              <StyledToggleButton
                key={it.id}
                text={it.name}
                active={it.id === selectedPoiCategory?.id}
                onPress={() => setSelectedPoiCategory(it.id === selectedPoiCategory?.id ? null : it)}
                Icon={<StyledSvgUri uri={it.icon} active={it.id === selectedPoiCategory?.id} />}
              />
            ))}
          </TileRow>
        </Section>
        <Section>
          <Button onPress={closeModal} mode='contained' disabled={poisCount === 0}>
            {t('showPois', { count: poisCount })}
          </Button>
        </Section>
      </Container>
    </Modal>
  )
}

export default PoiFiltersModal
