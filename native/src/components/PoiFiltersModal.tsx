import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'react-native-elements'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { PoiCategoryModel, PoiModel } from 'api-client'

import { ClockIcon, MobilityIcon } from '../assets'
import Modal from './Modal'
import SettingsSwitch from './SettingsSwitch'
import Text from './base/Text'

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 16px;
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
  width: 100%;
`

const StyledText = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
  padding: 4px;
`

const SortHint = styled.Text`
  align-self: flex-end;
  font-size: 12px;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
  padding: 0 4px;
`

const FlexEnd = styled.View`
  flex: 1;
`

const TileRow = styled(Row)`
  justify-content: space-between;
  align-content: space-between;
  flex-wrap: wrap;
`

const PoiCategoryTile = styled.Pressable<{ active: boolean }>`
  background-color: ${props => (props.active ? props.theme.colors.themeColor : props.theme.colors.backgroundColor)};
  padding: 8px;
  align-items: center;
  width: 100px;
  height: 80px;
  border-radius: 18px;
  elevation: 5;
  shadow-color: ${props => props.theme.colors.textColor};
  shadow-offset: 0px 1px;
  shadow-opacity: 0.2;
  shadow-radius: 1px;
  margin-bottom: 24px;
`

const PoiCategoryText = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondaryColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
`

type PoiFiltersModalProps = {
  modalVisible: boolean
  closeModal: () => void
  pois: PoiModel[]
  selectedPoiCategory: PoiCategoryModel | null
  setSelectedPoiCategory: (poiCategory: PoiCategoryModel | null) => void
  currentlyOpenFilter: boolean
  setCurrentlyOpenFilter: (currentlyOpen: boolean) => void
}

const PoiFiltersModal = ({
  modalVisible,
  closeModal,
  pois,
  selectedPoiCategory,
  setSelectedPoiCategory,
  currentlyOpenFilter,
  setCurrentlyOpenFilter,
}: PoiFiltersModalProps): ReactElement => {
  const poiCategories = pois
    .map(it => it.category)
    .filter((it, index, array) => array.findIndex(value => value.id === it.id) === index)
  const { t } = useTranslation('pois')
  const theme = useTheme()

  return (
    <Modal modalVisible={modalVisible} closeModal={closeModal} headerTitle='' title={t('adjustFilters')}>
      <Container>
        <Section>
          <SubTitle>{t('openingHours')}</SubTitle>
          <Row>
            <ClockIcon width={24} height={24} />
            <StyledText>{t('onlyCurrentlyOpen')}</StyledText>
            <FlexEnd>
              <SettingsSwitch onPress={setCurrentlyOpenFilter} value={currentlyOpenFilter} />
            </FlexEnd>
          </Row>
        </Section>
        <Section>
          <Row>
            <SubTitle>{t('poiCategories')}</SubTitle>
            <SortHint>{t('alphabetLetters')}</SortHint>
          </Row>
          <TileRow>
            {poiCategories.map(it => (
              <PoiCategoryTile
                key={it.id}
                active={it === selectedPoiCategory}
                onPress={() => setSelectedPoiCategory(it === selectedPoiCategory ? null : it)}>
                {/* TOOD: Use correct icon */}
                <MobilityIcon />
                <PoiCategoryText>{it.name}</PoiCategoryText>
              </PoiCategoryTile>
            ))}
          </TileRow>
        </Section>
        <Section>
          <Button
            onPress={closeModal}
            title={t('showPois')}
            buttonStyle={{
              backgroundColor: theme.colors.themeColor,
            }}
            titleStyle={{
              color: theme.colors.textColor,
              fontFamily: theme.fonts.native.contentFontRegular,
            }}
          />
        </Section>
      </Container>
    </Modal>
  )
}

export default PoiFiltersModal
