// @flow

import * as React from 'react'
import typeof I18nType from 'i18next'

const realModule = jest.requireActual('react-i18next')

const withTranslation = <S: {||}>(namespace: string) => (
  Component: React.AbstractComponent<{| ...S, t: string => string |}>
): React.AbstractComponent<S> => {
  return class extends React.Component<S> {
    render() {
      return <Component {...this.props} t={key => key} />
    }
  }
}

module.exports = {
  withTranslation,
  I18nextProvider: (props: { i18n: I18nType, children: React.Node }) => <>{props.children}</>,
  reactI18nextModule: realModule.reactI18nextModule
}
