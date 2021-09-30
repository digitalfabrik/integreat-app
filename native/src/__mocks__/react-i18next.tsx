import * as React from 'react'

const realModule = jest.requireActual('react-i18next')

const t = (key: string): string => key

const withTranslation = <T extends unknown>(_unusedNamespace: string) => (
  Component: React.ComponentType<T>
): React.ComponentType<T> => (props: T) => <Component {...props} t={t} />

const useTranslation = (_unusedNamespace: string | string[]) => ({
  t,
  i18n: {
    language: 'en'
  }
})

module.exports = {
  ...realModule,
  withTranslation,
  useTranslation,
  I18nextProvider: (props: { children: React.ReactNode }) => <>{props.children}</>,
  reactI18nextModule: realModule.reactI18nextModule
}
