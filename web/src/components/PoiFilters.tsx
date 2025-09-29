import AccessTimeIcon from '@mui/icons-material/AccessTime'
import Button from '@mui/material/Button'
import Typography, { TypographyProps } from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { PoiCategoryModel } from 'shared/api'

import ModalContent from './ModalContent'
import SpacedToggleButtonGroup from './SpacedToggleButtonGroup'
import Checkbox from './base/Checkbox'
import Icon from './base/Icon'
import ToggleButton, { toggleButtonWidth } from './base/ToggleButton'

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 16px 16px;
  gap: 24px;
`

const SubTitle = styled(Typography)<TypographyProps>`
  color: ${props => props.theme.palette.text.neutral};
`

const Section = styled('div')`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 24px;
`

const Row = styled('div')`
  display: flex;
  gap: 8px;
  align-items: center;
`

const TileRow = styled(SpacedToggleButtonGroup)`
  display: grid;
  gap: 24px 16px;
  justify-content: center;
  grid-template-columns: repeat(auto-fit, minmax(${toggleButtonWidth}px, 1fr));
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
  poisCount: number
}

const PoiFilters = ({
  closeModal,
  poiCategories,
  selectedPoiCategory,
  setSelectedPoiCategory,
  currentlyOpenFilter,
  setCurrentlyOpenFilter,
  poisCount,
}: PoiFiltersProps): ReactElement => {
  const { t } = useTranslation('pois')

  const handleFilterChange = (_: React.MouseEvent<HTMLElement>, newValue: number | null) => {
    const category = poiCategories.find(category => category.id === newValue)
    setSelectedPoiCategory(category ?? null)
  }

  return (
    <ModalContent title={t('adjustFilters')} closeModal={closeModal} small>
      <Container>
        <Section>
          <SubTitle variant='label1'>{t('openingHours')}</SubTitle>
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
            <SubTitle variant='label1'>{t('poiCategories')}</SubTitle>
            <Typography variant='label3'>{t('alphabetLetters')}</Typography>
          </Row>
          <TileRow exclusive value={selectedPoiCategory?.id} onChange={handleFilterChange}>
            {poiCategories.map(it => (
              <ToggleButton key={it.id} value={it.id} text={it.name} icon={it.icon} />
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
