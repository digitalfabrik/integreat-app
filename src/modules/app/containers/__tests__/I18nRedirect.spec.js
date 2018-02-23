import { mount } from 'enzyme'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import ConnectedI18nRedirect, { I18nRedirect } from '../I18nRedirect'
import PropTypes from 'prop-types'

describe('I18nRedirect', () => {
  it('should call redirect when mounting', () => {
    const redirect = jest.fn()
    mount(
      <I18nRedirect
        currentPath={'/augsburg/'}
        redirect={redirect} />,
      {context: {i18n: {language: 'de'}}, childContextTypes: {i18n: PropTypes.object.isRequired}} // fixme why can't we use I18nProvider here?
    )
    expect(redirect).toHaveBeenCalledWith('/augsburg/de')
  })

  it('should create correct store and pass it to Provider', () => {
    const mockStore = configureMockStore()

    const store = mockStore({
      router: {pathname: '/augsburg/'}
    })

    const tree = mount(
      <Provider store={store}>
        <ConnectedI18nRedirect />
      </Provider>,
      {context: {i18n: {language: 'de'}}, childContextTypes: {i18n: PropTypes.object.isRequired}} // fixme why can't we use I18nProvider here?
    )

    expect(tree.find(ConnectedI18nRedirect).childAt(0).props()).toMatchSnapshot()
  })
})
