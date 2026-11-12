import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary, { accordionSummaryClasses } from '@mui/material/AccordionSummary'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { AGE_GROUPS, CounselingProfile, filterSortRegions, RESIDENCE_STATUSES } from 'shared'
import { createRegionsEndpoint } from 'shared/api'

import buildConfig from '../constants/buildConfig'
import { cmsApiBaseUrl } from '../constants/urls'
import useLocalStorage, { COUNSELING_PROFILE_STORAGE_KEY } from '../hooks/useLocalStorage'
import useQueryFromEndpoint from '../hooks/useQueryFromEndpoint'

const Fields = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  gap: 16,

  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },
}))

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
}))

const StyledAccordionSummary = styled(AccordionSummary)({
  padding: 24,
  alignItems: 'flex-start',

  [`& .${accordionSummaryClasses.content}`]: {
    margin: 0,
  },
})

const StyledAccordionDetails = styled(AccordionDetails)({
  padding: 24,
  paddingTop: 0,
})

type SelectFieldProps<T extends string> = {
  id: string
  label: string
  value: T | undefined
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}

const SelectField = <T extends string>({ id, label, value, options, onChange }: SelectFieldProps<T>): ReactElement => {
  const { t } = useTranslation()
  const selectedOption = options.find(option => option.value === value)
  const labelId = `${id}-label`

  return (
    <Stack sx={{ gap: 1 }}>
      <Typography id={labelId} variant='subtitle2'>
        {label}
      </Typography>
      <Select
        labelId={labelId}
        size='small'
        displayEmpty
        value={selectedOption?.value ?? ''}
        renderValue={() => selectedOption?.label ?? t($ => $.bescheidCheck.counselingProfile.placeholder)}
        onChange={event => onChange(event.target.value as T)}>
        {options.map(option => (
          <MenuItem key={option.value} value={option.value} sx={{ whiteSpace: 'normal' }}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </Stack>
  )
}

type BescheidCheckCounselingProfileProps = {
  regionCode: string | undefined
}

const BescheidCheckCounselingProfile = ({ regionCode }: BescheidCheckCounselingProfileProps): ReactElement => {
  const [counselingProfile, setCounselingProfile] = useLocalStorage<CounselingProfile>({
    key: COUNSELING_PROFILE_STORAGE_KEY,
    initialValue: {},
  })
  const [draft, setDraft] = useState<CounselingProfile>({ regionCode, ...counselingProfile })
  const [expanded, setExpanded] = useState(false)
  const { data: regions = [] } = useQueryFromEndpoint(createRegionsEndpoint, cmsApiBaseUrl, undefined)
  const { t } = useTranslation()

  const updateDraft = (update: CounselingProfile) => setDraft(previous => ({ ...previous, ...update }))

  const submit = () => {
    setCounselingProfile(draft)
    setExpanded(false)
  }

  return (
    <StyledAccordion
      variant='outlined'
      disableGutters
      expanded={expanded}
      onChange={(_, isExpanded) => setExpanded(isExpanded)}
      slotProps={{ heading: { component: 'h2' } }}>
      <StyledAccordionSummary
        id='counseling-profile-header'
        aria-controls='counseling-profile-content'
        expandIcon={<ExpandMoreIcon />}>
        <Stack sx={{ gap: 1 }}>
          <Typography variant='subtitle1'>{t($ => $.bescheidCheck.counselingProfile.title)}</Typography>
          <Typography variant='body2'>{t($ => $.bescheidCheck.counselingProfile.description)}</Typography>
        </Stack>
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <Stack sx={{ gap: 3 }}>
          <Alert severity='info'>
            <Trans ns='bescheidCheck' i18nKey={$ => $.bescheidCheck.counselingProfile.privacy} />
          </Alert>
          <Fields>
            <SelectField
              id='counseling-profile-residence-status'
              label={t($ => $.bescheidCheck.counselingProfile.residenceStatus.label)}
              value={draft.residenceStatus}
              options={RESIDENCE_STATUSES.map(residenceStatus => ({
                value: residenceStatus,
                label: t($ => $.bescheidCheck.counselingProfile.residenceStatus.options[residenceStatus]),
              }))}
              onChange={residenceStatus => updateDraft({ residenceStatus })}
            />
            <SelectField
              id='counseling-profile-age'
              label={t($ => $.bescheidCheck.counselingProfile.age.label)}
              value={draft.age}
              options={AGE_GROUPS.map(age => ({
                value: age,
                label: t($ => $.bescheidCheck.counselingProfile.age.options[age]),
              }))}
              onChange={age => updateDraft({ age })}
            />
            <SelectField
              id='counseling-profile-region'
              label={t($ => $.bescheidCheck.counselingProfile.region.label)}
              value={draft.regionCode}
              options={filterSortRegions(regions, '', buildConfig().featureFlags.developerFriendly).map(region => ({
                value: region.code,
                label: region.name,
              }))}
              onChange={code => updateDraft({ regionCode: code })}
            />
            <Stack direction='row' sx={{ gap: 1 }}>
              <InfoOutlinedIcon fontSize='small' />
              <Typography variant='body2'>{t($ => $.bescheidCheck.counselingProfile.hint)}</Typography>
            </Stack>
          </Fields>
          <Button variant='contained' onClick={submit} sx={{ alignSelf: 'flex-end' }}>
            {t($ => $.bescheidCheck.counselingProfile.submit)}
          </Button>
        </Stack>
      </StyledAccordionDetails>
    </StyledAccordion>
  )
}

export default BescheidCheckCounselingProfile
