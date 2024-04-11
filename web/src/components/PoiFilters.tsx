import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { PoiCategoryModel } from 'shared/api'

import { ClockIcon } from '../assets'
import ModalContent from './ModalContent'
import Checkbox from './base/Checkbox'
import Icon from './base/Icon'
import TextButton from './base/TextButton'
import ToggleButton, { toggleButtonWidth } from './base/ToggleButton'

const tileColumnGap = 16

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 16px 16px;
  gap: 24px;
`

const SubTitle = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.web.decorativeFont};
  font-weight: bold;
`

const Section = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 24px;
`

const Row = styled.div`
  display: flex;
`

const SortingHint = styled.div`
  align-self: flex-end;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.web.decorativeFont};
  padding: 0 4px;
`

const TileRow = styled.div<{ itemCount: number }>`
  display: grid;
  gap: 24px ${tileColumnGap}px;
  justify-content: center;
  grid-template-columns: repeat(${props => props.itemCount}, ${toggleButtonWidth}px);
`

const StyledButton = styled(TextButton)`
  width: 100%;
  margin: 0;
`

const StyledIcon = styled(Icon)`
  width: 24px;
  height: 24px;
`

type PoiFiltersProps = {
  closeModal: () => void
  poiCategories: PoiCategoryModel[]
  selectedPoiCategory: PoiCategoryModel | undefined
  setSelectedPoiCategory: (poiCategory: PoiCategoryModel | null) => void
  currentlyOpenFilter: boolean
  setCurrentlyOpenFilter: (currentlyOpen: boolean) => void
  panelWidth: number
  poisCount: number
}

const PoiFilters = ({
  closeModal,
  poiCategories,
  selectedPoiCategory,
  setSelectedPoiCategory,
  currentlyOpenFilter,
  setCurrentlyOpenFilter,
  panelWidth,
  poisCount,
}: PoiFiltersProps): ReactElement => {
  const { t } = useTranslation('pois')

  return (
    <ModalContent title={t('adjustFilters')} closeModal={closeModal} small>
      <Container>
        <Section>
          <SubTitle>{t('openingHours')}</SubTitle>
          <Row>
            <StyledIcon src={ClockIcon} />
            <Checkbox
              id='poi-filters-currently-opened'
              checked={currentlyOpenFilter}
              setChecked={setCurrentlyOpenFilter}
              label={t('onlyCurrentlyOpen')}
            />
          </Row>
        </Section>
        <Section>
          <Row>
            <SubTitle>{t('poiCategories')}</SubTitle>
            <SortingHint>{t('alphabetLetters')}</SortingHint>
          </Row>
          <TileRow itemCount={Math.floor(panelWidth / (toggleButtonWidth + tileColumnGap))}>
            {poiCategories.map(it => (
              <ToggleButton
                key={it.id}
                text={it.name}
                active={it.id === selectedPoiCategory?.id}
                onClick={() => setSelectedPoiCategory(it.id === selectedPoiCategory?.id ? null : it)}
                icon={it.icon}
              />
            ))}
          </TileRow>
        </Section>
        <StyledButton onClick={closeModal} text={t('showPois', { count: poisCount })} disabled={poisCount === 0} />
      </Container>
    </ModalContent>
  )
}

export default PoiFilters
