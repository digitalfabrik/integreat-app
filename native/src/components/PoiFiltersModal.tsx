import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { SvgUri } from 'react-native-svg'
import styled from 'styled-components/native'

import { PoiCategoryModel, PoiModel } from 'api-client'

import { ClockIcon } from '../assets'
import Modal from './Modal'
import SettingsSwitch from './SettingsSwitch'
import Icon from './base/Icon'
import Text from './base/Text'
import TextButton from './base/TextButton'
import ToggleButton from './base/ToggleButton'

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
`

const SubTitle = styled(Text)`
  font-size: 14px;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
`

const Section = styled.View`
  padding-top: 16px;
  width: 100%;
`

const Row = styled.View`
  flex-direction: row;
  padding-top: 16px;
`

const StyledText = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
  padding: 4px;
`

const SortingHint = styled.Text`
  align-self: flex-end;
  font-size: 12px;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
  padding: 0 4px;
`

const FlexEnd = styled.View`
  flex: 1;
  justify-content: flex-end;
`

const TileRow = styled(Row)`
  justify-content: center;
  align-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
`

const StyledToggleButton = styled(ToggleButton)`
  margin-bottom: 8px;
`

const StyledTextButton = styled(TextButton)`
  margin-top: 16px;
`

type PoiFiltersModalProps = {
  modalVisible: boolean
  closeModal: () => void
  pois: PoiModel[]
  selectedPoiCategory: PoiCategoryModel | null
  setSelectedPoiCategory: (poiCategory: PoiCategoryModel | null) => void
  currentlyOpenFilter: boolean
  setCurrentlyOpenFilter: (currentlyOpen: boolean) => void
  poisLength: number
}

const PoiFiltersModal = ({
  modalVisible,
  closeModal,
  pois,
  selectedPoiCategory,
  setSelectedPoiCategory,
  currentlyOpenFilter,
  setCurrentlyOpenFilter,
  poisLength,
}: PoiFiltersModalProps): ReactElement => {
  const poiCategories = pois
    .map(it => it.category)
    .filter((it, index, array) => array.findIndex(value => value.id === it.id) === index)
  const { t } = useTranslation('pois')

  return (
    <Modal modalVisible={modalVisible} closeModal={closeModal} headerTitle='' title={t('adjustFilters')}>
      <Container>
        <Section>
          <SubTitle>{t('openingHours')}</SubTitle>
          <Row>
            <Icon Icon={ClockIcon} />
            <StyledText>{t('onlyCurrentlyOpen')}</StyledText>
            <FlexEnd>
              <SettingsSwitch onPress={setCurrentlyOpenFilter} value={currentlyOpenFilter} />
            </FlexEnd>
          </Row>
        </Section>
        <Section>
          <Row>
            <SubTitle>{t('poiCategories')}</SubTitle>
            <SortingHint>{t('alphabetLetters')}</SortingHint>
          </Row>
          <TileRow>
            {poiCategories.map(it => (
              <StyledToggleButton
                key={it.id}
                text={it.name}
                active={it.id === selectedPoiCategory?.id}
                onPress={() => setSelectedPoiCategory(it.id === selectedPoiCategory?.id ? null : it)}
                Icon={<SvgUri uri={it.icon} />}
              />
            ))}
          </TileRow>
        </Section>
        <Section>
          {poisLength !== 0 ? (
            <StyledTextButton onPress={closeModal} text={` ${poisLength} ${t('showPois')} `} />
          ) : (
            <StyledTextButton onPress={closeModal} text={t('noPois')} disabled />
          )}
        </Section>
      </Container>
    </Modal>
  )
}

export default PoiFiltersModal
