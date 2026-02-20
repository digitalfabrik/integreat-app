// eslint-disable-next-line import-x/no-import-module-exports
import * as React from 'react'

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
  I18nextProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  reactI18nextModule: realModule.reactI18nextModule,
  Trans: ({ i18nKey }: { i18nKey: string }) => <span>{i18nKey}</span>,
}
