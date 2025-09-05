import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import Selector from '../components/Selector'
import SelectorItemModel from '../models/SelectorItemModel'

type LanguageSelectorProps = {
  languageChangePaths: { code: string; path: string | null; name: string }[] | null
  languageCode: string
  vertical: boolean
  close?: () => void
  availableOnly?: boolean
}

const LanguageSelector = ({
  languageChangePaths,
  languageCode,
  vertical,
  close,
  availableOnly = false,
}: LanguageSelectorProps): ReactElement => {
  const { t } = useTranslation('layout')

  const selectorItems =
    languageChangePaths
      ?.filter(it => !availableOnly || it.path)
      .map(
        ({ code, name, path }) =>
          new SelectorItemModel({
            code,
            name,
            href: path,
          }),
      ) ?? []

  return (
    <Selector
      close={close}
      verticalLayout={vertical}
      items={selectorItems}
      activeItemCode={languageCode}
      disabledItemTooltip={t('noTranslation')}
    />
  )
}

export default LanguageSelector
