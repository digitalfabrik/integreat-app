import Autocomplete from '@mui/material/Autocomplete'
import List from '@mui/material/List'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { normalizeString } from 'shared'
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

export type LanguageChangePath = {
  code: string
  path: string | null
  name: string
}

export const filterLanguageChangePath = (
  languageChangePath: LanguageChangePath,
  query: string,
  languageNamesInCurrentLanguage: Intl.DisplayNames,
  languageNamesInFallbackLanguage: Intl.DisplayNames,
): boolean => {
  if (query === '') {
    return true
  }
  const normalizedQuery = normalizeString(query)
  return (
    normalizeString(languageChangePath.name).includes(normalizedQuery) ||
    normalizeString(languageNamesInCurrentLanguage.of(languageChangePath.code) || '').includes(normalizedQuery) ||
    normalizeString(languageNamesInFallbackLanguage.of(languageChangePath.code) || '').includes(normalizedQuery)
  )
}

type LanguageListProps = {
  languageChangePaths: LanguageChangePath[]
  languageCode: string
  close?: () => void
  availableOnly?: boolean
  asList?: boolean
}

const LanguageList = ({
  languageChangePaths,
  languageCode,
  close,
  availableOnly = false,
  asList = false,
}: LanguageListProps): ReactElement => {
  const [query, setQuery] = useState('')
  const { t } = useTranslation('layout')
  const { mobile } = useDimensions()

  const allOptions = useMemo(
    () => languageChangePaths.filter(item => !availableOnly || !!item.path),
    [languageChangePaths, availableOnly],
  )

  const currentLanguage = allOptions.find(item => item.code === languageCode)

  const filteredLanguageChangePaths = useMemo(() => {
    const languageNamesInCurrentLanguage = new Intl.DisplayNames([languageCode], { type: 'language' })
    const languageNamesInFallbackLanguage = new Intl.DisplayNames([config.sourceLanguage], { type: 'language' })
    return languageChangePaths.filter(item =>
      filterLanguageChangePath(item, query, languageNamesInCurrentLanguage, languageNamesInFallbackLanguage),
    )
  }, [languageChangePaths, query, languageCode])

  if (mobile || asList) {
    return (
      <Stack gap={2}>
        <SearchInput placeholderText={currentLanguage?.name ?? ''} filterText={query} onFilterTextChange={setQuery} />
        <>
          {filteredLanguageChangePaths.length === 0 ? (
            t('noLanguageFound')
          ) : (
            <List disablePadding>
              {filteredLanguageChangePaths.map(language => (
                <LanguageListItem
                  key={language.code}
                  code={language.code}
                  path={language.path}
                  name={language.name}
                  close={close}
                  selectedLanguageCode={currentLanguage?.code}
                />
              ))}
            </List>
          )}
        </>
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
      renderOption={(_, language) => (
        <LanguageListItem
          code={language.code}
          path={language.path}
          name={language.name}
          close={close}
          selectedLanguageCode={currentLanguage?.code}
          key={language.code}
        />
      )}
      noOptionsText={t('noLanguageFound')}
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
export default LanguageList
