import * as React from 'react'
type I18nType = typeof import('i18next').default
const realModule = jest.requireActual('react-i18next')

const withTranslation = (namespace: string) => (
  Component: React.ComponentType<any>
): React.ComponentType<any> => {
  return class extends React.Component<any> {
    render() {
      return <Component {...this.props} t={key => key} />
    }
  }
}

module.exports = {
  withTranslation,
  I18nextProvider: (props: { i18n: I18nType; children: React.ReactNode }) => <>{props.children}</>,
  reactI18nextModule: realModule.reactI18nextModule
}
