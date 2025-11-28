import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import TextField from '@mui/material/TextField'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { config } from 'translations'

import useDimensions from '../hooks/useDimensions'
import LanguageListItem from './LanguageListItem'
import SearchInput from './SearchInput'

const MobileContainer = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  gap: ${props => props.theme.spacing(2)};
`

const StyledAutocomplete = styled(Autocomplete)`
  ${props => props.theme.breakpoints.up('md')} {
    width: 200px;
    position: absolute;
    top: 72px;
    z-index: 10;
  }
` as typeof Autocomplete

const StyledTextField = styled(TextField)`
  legend {
    letter-spacing: 0;
  }
` as typeof TextField

export type LanguageChangePath = {
  code: string
  path: string | null
  name: string
}

type LanguageListProps = {
  languageChangePaths: LanguageChangePath[]
  languageCode: string
  close?: () => void
  availableOnly?: boolean
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
  return (
    languageChangePath.name.toLowerCase().includes(query.toLowerCase()) ||
    !!languageNamesInCurrentLanguage.of(languageChangePath.code)?.toLowerCase().includes(query.toLowerCase()) ||
    !!languageNamesInFallbackLanguage.of(languageChangePath.code)?.toLowerCase().includes(query.toLowerCase())
  )
}

const LanguageList = ({
  languageChangePaths,
  languageCode,
  close,
  availableOnly = false,
}: LanguageListProps): ReactElement => {
  const { t } = useTranslation('layout')
  const { mobile } = useDimensions()
  const [query, setQuery] = useState('')

  const allOptions = useMemo(
    () => languageChangePaths.filter(item => !availableOnly || item.path),
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

  if (mobile) {
    return (
      <MobileContainer>
        <SearchInput placeholderText={currentLanguage?.name ?? ''} filterText={query} onFilterTextChange={setQuery} />

        <>
          {filteredLanguageChangePaths.length === 0 ? (
            <Box sx={{ p: 2 }}>{t('noLanguageFound')}</Box>
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
      </MobileContainer>
    )
  }

  return (
    <StyledAutocomplete
      open
      filterOptions={options => options} // disable built-in filtering to use custom filter
      options={filteredLanguageChangePaths}
      renderInput={props => (
        <StyledTextField {...props} placeholder={currentLanguage?.name} size='small' variant='outlined' />
      )}
      inputValue={query}
      onInputChange={(_, value) => setQuery(value)}
      forcePopupIcon={false}
      getOptionLabel={(option: LanguageChangePath) => option.name}
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
          placement: 'bottom-start',
          modifiers: [
            {
              name: 'flip',
              enabled: false,
            },
          ],
        },
      }}
    />
  )
}
export default LanguageList
