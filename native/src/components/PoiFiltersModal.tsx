import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { PoiCategoryModel, PoiModel } from 'api-client'

import { ClockIcon, MobilityIcon } from '../assets'
import Modal from './Modal'
import SettingsSwitch from './SettingsSwitch'
import Text from './base/Text'

const Container = styled.View`
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
`

const PoiCategoryTile = styled.Pressable`
  padding: 8px;
  align-items: center;
  width: 100px;
  height: 80px;
  border-radius: 18px;
  elevation: 1;
  shadow-color: ${props => props.theme.colors.textColor};
  shadow-offset: 0px 1px;
  shadow-opacity: 0.2;
  shadow-radius: 1px;
`
//   <svg width="110" height="90" viewBox="0 0 110 90" fill="none" xmlns="http://www.w3.org/2000/svg">
//   <g filter="url(#filter0_dd_1439_222)">
//   <rect x="5" y="4" width="100" height="80" rx="18" fill="#FAFAFA"/>
//   </g>
// <defs>
//   <filter id="filter0_dd_1439_222" x="0" y="0" width="110" height="90" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
//     <feFlood flood-opacity="0" result="BackgroundImageFix"/>
//     <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
//     <feMorphology radius="1" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_1439_222"/>
//     <feOffset dy="1"/>
//     <feGaussianBlur stdDeviation="2"/>
//     <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
//     <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1439_222"/>
//     <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
//     <feOffset dy="1"/>
//     <feGaussianBlur stdDeviation="1"/>
//     <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
//     <feBlend mode="normal" in2="effect1_dropShadow_1439_222" result="effect2_dropShadow_1439_222"/>
//     <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_1439_222" result="shape"/>
//   </filter>
// </defs>
// </svg>

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
    .slice(0, 3)
  const { t } = useTranslation('pois')

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
              <PoiCategoryTile key={it.id} onPress={() => setSelectedPoiCategory(it)}>
                <MobilityIcon />
                <PoiCategoryText>{it.name}</PoiCategoryText>
              </PoiCategoryTile>
            ))}
          </TileRow>
        </Section>
      </Container>
    </Modal>
  )
}

export default PoiFiltersModal
