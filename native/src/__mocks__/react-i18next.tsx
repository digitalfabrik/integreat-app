// eslint-disable-next-line import/no-import-module-exports
import React, { ReactNode } from 'react'

const realModule = jest.requireActual('react-i18next')

const t = (key: string): string => key

const useTranslation = (_unusedNamespace: string | string[]) => ({
  t,
  i18n: {
    language: 'en',
  },
})

module.exports = {
  ...realModule,
  useTranslation,
  I18nextProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  reactI18nextModule: realModule.reactI18nextModule,
  Trans: ({ i18nKey }: { i18nKey: string }) => <span>{i18nKey}</span>,
}
