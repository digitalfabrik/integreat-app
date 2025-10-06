import Divider from '@mui/material/Divider'
import React, { ReactElement } from 'react'

import { LanguageModel } from 'shared/api'
import { config } from 'translations'

export const join = <T, U>(items: T[], separator: (index: number) => U): (T | U)[] =>
  items.flatMap((item, index) => [item, separator(index)]).slice(0, -1)

export const withDividers = (items: (ReactElement | null)[]): ReactElement[] =>
  join(
    items.filter(it => it !== null),
    index => <Divider key={index} />,
  )

export const supportedLanguages: LanguageModel[] = Object.entries(config.supportedLanguages)
  .map(([code, language]) => new LanguageModel(code, language.name))
  .sort((a, b) => a.code.localeCompare(b.code))
