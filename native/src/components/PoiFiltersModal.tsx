import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { SvgUri } from 'react-native-svg'
import styled from 'styled-components/native'

import { PoiCategoryModel } from 'shared/api'

import { ClockIcon } from '../assets'
import Modal from './Modal'
import Icon from './base/Icon'
import SettingsSwitch from './base/SettingsSwitch'
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
  place-content: space-between center;
  flex-wrap: wrap;
  gap: 16px;
`

const StyledToggleButton = styled(ToggleButton)`
  margin-bottom: 8px;
`

const StyledTextButton = styled(TextButton)`
  margin-bottom: 16px;
`
const StyledScrollView = styled.ScrollView`
  height: 100%;
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
        <StyledScrollView>
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
              {poiCategories.map(item => (
                <StyledToggleButton
                  key={item.id}
                  text={item.name}
                  active={item.id === selectedPoiCategory?.id}
                  onPress={() => setSelectedPoiCategory(item.id === selectedPoiCategory?.id ? null : item)}
                  Icon={<SvgUri uri={item.icon} />}
                />
              ))}
            </TileRow>
          </Section>
        </StyledScrollView>
        <Section>
          <StyledTextButton
            onPress={closeModal}
            text={t('showPois', { count: poisCount })}
            disabled={poisCount === 0}
          />
        </Section>
      </Container>
    </Modal>
  )
}

export default PoiFiltersModal
