// @flow

import { mount } from 'enzyme'
import LanguageDetector from 'i18next-browser-languagedetector'
import React from 'react'
import i18next from 'i18next'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import ConnectedI18nProvider, { I18nProvider } from '../I18nProvider'
import { I18nextProvider } from 'react-i18next'
import loadTranslations from '../../loadTranslations'

const mockStore = configureMockStore()

describe('I18nProvider', () => {
  it('should match snapshot', () => {
    const component = mount(<I18nProvider setUiDirection={() => {}}>
      <div />
    </I18nProvider>)
    // Check snapshot except for I18nextProvider's props (because there are all resources)
    expect(component.children()).toHaveLength(1)
    const i18nextProvider = component.children().at(0)
    expect(i18nextProvider.name()).toEqual('I18nextProvider')
    expect(i18nextProvider.children()).toMatchSnapshot()
  })

  it('should initialize correct i18next instance', () => {
    const unmockedCreateInstance = i18next.createInstance.bind(i18next)
    const i18nInstance = unmockedCreateInstance()
    i18next.createInstance = jest.fn(() => {
      i18nInstance.init = jest.fn(i18nInstance.init)
      i18nInstance.use = jest.fn(i18nInstance.use)
      return i18nInstance
    })

    const component = mount(<I18nProvider setUiDirection={() => {}}>
      <div />
    </I18nProvider>)

    expect(i18next.createInstance.mock.calls).toHaveLength(1)
    expect(i18nInstance.use).toHaveBeenCalledWith(LanguageDetector)

    expect(component.find(I18nextProvider).prop('i18n')).toBe(i18nInstance)

    expect(i18nInstance.init.mock.calls).toHaveLength(1)
    expect(i18nInstance.init.mock.calls[0]).toHaveLength(1)
    const options = i18nInstance.init.mock.calls[0][0]

    expect(options.resources).toEqual(loadTranslations())
    delete options.resources

    expect(options).toMatchSnapshot()
    i18next.createInstance = unmockedCreateInstance
  })

  it('should detect en-US', () => {
    const component = mount(<I18nProvider setUiDirection={() => {}}>
      <div />
    </I18nProvider>)

    const i18n = component.find(I18nextProvider).prop('i18n')
    expect(i18n.language).toEqual('en-US')
    expect(component.state()).toEqual({
      language: 'en-US',
      i18nLoaded: true,
      fonts: { lateef: false, openSans: true, raleway: true }
    })
  })

  it('should call updateLanguage on property change', () => {
    const component = mount(<I18nProvider setUiDirection={() => {}}>
      <div />
    </I18nProvider>)

    const instance: any = component.instance()
    instance.updateLanguage = jest.fn()

    component.setProps({ language: 'de' })
    expect(component.instance().updateLanguage).toHaveBeenCalledWith('de')
  })

  it('should connect to the store', () => {
    const store = mockStore({ location: { payload: { language: 'language1' } } })
    const component = mount(<Provider store={store}>
      <ConnectedI18nProvider>
        <div />
      </ConnectedI18nProvider>
    </Provider>)

    expect(component.find(I18nProvider).props()).toMatchSnapshot()
  })

  describe('updateLanguage', () => {
    it('should take param language if param is defined', () => {
      const component = mount(<I18nProvider setUiDirection={() => {}}>
        <div />
      </I18nProvider>)

      const i18n = component.find(I18nextProvider).prop('i18n')

      const expectedLanguage = 'ar'

      const originalGetSelectedFonts = I18nProvider.getSelectedFonts
      // $FlowFixMe
      I18nProvider.getSelectedFonts = jest.fn(I18nProvider.getSelectedFonts)
      i18n.changeLanguage = jest.fn(i18n.changeLanguage)

      component.instance().updateLanguage(expectedLanguage)

      // $FlowFixMe
      expect(document.documentElement.lang).toEqual(expectedLanguage)
      expect(i18n.changeLanguage).toHaveBeenCalledWith(expectedLanguage, expect.any(Function))
      expect(I18nProvider.getSelectedFonts).toHaveBeenCalledWith(expectedLanguage)
      expect(component.state()).toEqual({
        language: expectedLanguage,
        i18nLoaded: true,
        fonts: { lateef: true, openSans: true, raleway: true }
      })
      // $FlowFixMe
      I18nProvider.getSelectedFonts = originalGetSelectedFonts
    })
  })

  it('should add direction style depending on language', () => {
    const mockSetUiDirection = jest.fn()
    const component = mount(<I18nProvider language='en' setUiDirection={mockSetUiDirection}>
      <div />
    </I18nProvider>)
    expect(component.find('div').at(0).prop('style').direction).toEqual('ltr')
    component.setProps({ language: 'ar' })
    component.update()
    expect(component.find('div').at(0).prop('style').direction).toEqual('rtl')
    expect(mockSetUiDirection).toHaveBeenCalledWith('rtl')
  })
})
