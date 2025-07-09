import styled from '@emotion/styled'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { ToggleButtonGroup } from '@mui/material'
import Button from '@mui/material/Button'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { PoiCategoryModel } from 'shared/api'

import ModalContent from './ModalContent'
import Checkbox from './base/Checkbox'
import Icon from './base/Icon'
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
  gap: 8px;
  align-items: center;
`

const SortingHint = styled.div`
  align-self: flex-end;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.web.decorativeFont};
  padding: 0 4px;
`

const TileRow = styled(ToggleButtonGroup)<{ itemCount: number }>`
  display: grid;
  gap: 24px ${tileColumnGap}px;
  justify-content: center;
  grid-template-columns: repeat(${props => props.itemCount}, ${toggleButtonWidth}px);

  & [class*='MuiToggleButton-root'] {
    border-radius: 18px;
  }
`

const StyledButton = styled(Button)`
  width: 100%;
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

  const handleFilterChange = (event: React.MouseEvent<HTMLElement>, newValue: string | null) => {
    const category = poiCategories.find(cat => cat.id.toString() === newValue)
    setSelectedPoiCategory(category ?? null)
  }

  return (
    <ModalContent title={t('adjustFilters')} closeModal={closeModal} small>
      <Container>
        <Section>
          <SubTitle>{t('openingHours')}</SubTitle>
          <Row>
            <StyledIcon src={AccessTimeIcon} />
            <Checkbox
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
          <TileRow
            itemCount={Math.floor(panelWidth / (toggleButtonWidth + tileColumnGap))}
            exclusive
            value={selectedPoiCategory?.id.toString()}
            onChange={handleFilterChange}>
            {poiCategories.map(it => (
              <ToggleButton iconSize='medium' key={it.id} value={it.id.toString()} text={it.name} icon={it.icon} />
            ))}
          </TileRow>
        </Section>
        <StyledButton onClick={closeModal} variant='contained' disabled={poisCount === 0}>
          {t('showPois', { count: poisCount })}
        </StyledButton>
      </Container>
    </ModalContent>
  )
}

export default PoiFilters
