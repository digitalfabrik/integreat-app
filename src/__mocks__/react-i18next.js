// @flow

import * as React from 'react'

const reactI18next = jest.requireActual('react-i18next')

reactI18next.translate = () => Component => props => <Component {...props} t={key => key} />

reactI18next.I18nextProvider = null
// fixme clean this mock up

module.exports = {
  translate: () => Component => props => <Component {...props} t={key => key} />,
  I18nextProvider: props => <>{props.children}</>,
  reactI18nextModule: reactI18next.reactI18nextModule,
  default: reactI18next
}
