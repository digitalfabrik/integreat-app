import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import TextField from '@mui/material/TextField'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import useDimensions from '../hooks/useDimensions'
import LanguageSelectorItem from './LanguageSelectorItem'

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
  width: 100%;

  ${props => props.theme.breakpoints.up('md')} {
    width: 200px;
  }

  & legend {
    letter-spacing: 0;
  }
` as typeof TextField

export type LanguageChangePath = {
  code: string
  path: string | null
  name: string
}

type LanguageSelectorProps = {
  languageChangePaths: LanguageChangePath[]
  languageCode: string
  close?: () => void
  availableOnly?: boolean
}

const LanguageSelector = ({
  languageChangePaths,
  languageCode,
  close,
  availableOnly = false,
}: LanguageSelectorProps): ReactElement => {
  const { t } = useTranslation('layout')
  const { mobile } = useDimensions()
  const [query, setQuery] = useState('')

  const allOptions = useMemo(
    () => languageChangePaths.filter(item => !availableOnly || item.path),
    [languageChangePaths, availableOnly],
  )

  const currentLanguage = allOptions.find(item => item.code === languageCode)

  if (mobile) {
    const filteredLanguageChangePaths = languageChangePaths.filter(item =>
      query === '' ? true : item.name.toLowerCase().includes(query.toLowerCase()),
    )

    return (
      <MobileContainer>
        <StyledTextField
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder={currentLanguage?.name}
          size='small'
          variant='outlined'
        />

        <>
          {filteredLanguageChangePaths.length === 0 ? (
            <Box sx={{ p: 2 }}>{t('noLanguageFound')}</Box>
          ) : (
            <List disablePadding>
              {filteredLanguageChangePaths.map(language => (
                <LanguageSelectorItem
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
      options={allOptions}
      renderInput={props => (
        <StyledTextField {...props} placeholder={currentLanguage?.name} size='small' variant='outlined' />
      )}
      getOptionLabel={(option: LanguageChangePath) => option.name}
      renderOption={(_, language) => (
        <LanguageSelectorItem
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
export default LanguageSelector
