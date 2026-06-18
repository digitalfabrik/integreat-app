import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { styled } from '@mui/material/styles'
import React, { Fragment, ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { filterLanguages } from 'shared'
import { config } from 'translations'

import useDimensions from '../hooks/useDimensions'
import LanguageListItem from './LanguageListItem'
import SearchInput from './SearchInput'

const StyledAutocomplete = styled(Autocomplete)`
  ${props => props.theme.breakpoints.up('md')} {
    background-color: ${props => props.theme.palette.background.paper};
    width: 200px;
    border-radius: 4px;
  }
` as typeof Autocomplete

const StyledTextField = styled(TextField)({
  legend: {
    letterSpacing: 0,
  },
})

const StyledUnavailableLanguageButton = styled(Button)({
  margin: '2px 8px',
  textTransform: 'none',
})

export type LanguageChangePath = {
  code: string
  path: string | null
  name: string
}

type UnavailableLanguageButtonProps = {
  onClick?: () => void
  label: string
}

const UnavailableLanguageButton = ({ onClick, label }: UnavailableLanguageButtonProps): ReactElement => (
  <StyledUnavailableLanguageButton variant='outlined' onClick={onClick}>
    {label}
  </StyledUnavailableLanguageButton>
)

type LanguageSelectionProps = {
  languageChangePaths: LanguageChangePath[]
  languageCode: string
  close?: () => void
  availableOnly?: boolean
  asList?: boolean
  onUnavailableLanguageClick?: () => void
}

const LanguageSelection = ({
  languageChangePaths,
  languageCode,
  close,
  availableOnly = false,
  asList = false,
  onUnavailableLanguageClick,
}: LanguageSelectionProps): ReactElement => {
  const [query, setQuery] = useState('')
  const { t } = useTranslation('layout')
  const { mobile } = useDimensions()

  const allOptions = languageChangePaths.filter(item => !availableOnly || !!item.path)

  const currentLanguage = allOptions.find(item => item.code === languageCode)

  const filteredLanguageChangePaths = filterLanguages(languageChangePaths, query, languageCode, config.sourceLanguage)

  if (mobile || asList) {
    return (
      <Stack gap={2}>
        <SearchInput placeholderText={currentLanguage?.name ?? ''} filterText={query} onFilterTextChange={setQuery} />
        <List disablePadding>
          {filteredLanguageChangePaths.map(language => (
            <LanguageListItem
              key={language.code}
              code={language.code}
              path={language.path}
              name={language.name}
              close={close}
              selectedLanguageCode={currentLanguage?.code}
              onUnavailableLanguageClick={onUnavailableLanguageClick}
            />
          ))}
        </List>
        <UnavailableLanguageButton onClick={onUnavailableLanguageClick} label={t('languageNotFoundQuestion')} />
      </Stack>
    )
  }

  return (
    <StyledAutocomplete
      data-testid='languageList'
      open
      filterOptions={options => options} // disable built-in filtering to use custom filter
      options={filteredLanguageChangePaths}
      renderInput={props => (
        <StyledTextField {...props} placeholder={currentLanguage?.name} size='small' variant='outlined' />
      )}
      inputValue={query}
      onInputChange={(_, value) => setQuery(value)}
      forcePopupIcon={false}
      getOptionLabel={option => option.name}
      renderOption={(_, language, { index }) => (
        <Fragment key={language.code}>
          <LanguageListItem
            code={language.code}
            path={language.path}
            name={language.name}
            close={close}
            selectedLanguageCode={currentLanguage?.code}
            onUnavailableLanguageClick={onUnavailableLanguageClick}
            key={language.code}
          />
          {index === filteredLanguageChangePaths.length - 1 && (
            <UnavailableLanguageButton onClick={onUnavailableLanguageClick} label={t('languageNotFoundQuestion')} />
          )}
        </Fragment>
      )}
      noOptionsText={
        <UnavailableLanguageButton onClick={onUnavailableLanguageClick} label={t('languageNotFoundQuestion')} />
      }
      disablePortal
      slotProps={{
        popper: {
          placement: 'bottom',
          modifiers: [
            {
              name: 'flip',
              enabled: false,
            },
            {
              name: 'offset',
              options: {
                offset: [0, 1],
              },
            },
          ],
        },
      }}
    />
  )
}
export default LanguageSelection
