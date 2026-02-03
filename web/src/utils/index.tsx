import Divider from '@mui/material/Divider'
import React, { ReactElement } from 'react'

import { join } from 'shared'
import { LanguageModel, request } from 'shared/api'
import { config } from 'translations'

export const withDividers = (items: (ReactElement | null)[]): ReactElement[] =>
  join(
    items.filter(it => it !== null),
    index => <Divider key={index} />,
  )

export const supportedLanguages: LanguageModel[] = Object.entries(config.supportedLanguages)
  .map(([code, language]) => new LanguageModel(code, language.name))
  .sort((a, b) => a.code.localeCompare(b.code))

export const fetchObjectCached = async (url: string | null): Promise<{ objectUrl: string } | null> => {
  if (!url) {
    return null
  }
  const response = await request(url, {})
  const blob = await response.blob()
  return { objectUrl: URL.createObjectURL(blob) }
}
