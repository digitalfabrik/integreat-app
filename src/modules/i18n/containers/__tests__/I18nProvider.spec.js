// @flow

import { mount } from 'enzyme'
import LanguageDetector from 'i18next-browser-languagedetector'
import React from 'react'
import i18next from 'i18next'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import ConnectedI18nProvider, { I18nProvider } from '../I18nProvider'
import { I18nextProvider } from 'react-i18next'
import resources from '../../../../../locales/locales.json'

const mockStore = configureMockStore()

// eslint-disable-next-line jest/no-disabled-tests
describe.skip('I18nProvider', () => {
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

  it('should transform the resources correctly', () => {
    const input = {
      'module1': {
        'language1': {
          'key1': 'lang1-translated1'
        },
        'language2': {
          'key1': 'lang2-translated1'
        }
      },
      'module2': {
        'language1': {
          'key2': 'lang1-translated2'
        },
        'language2': {
          'key2': 'lang2-translated2'
        }
      }
    }
    expect(I18nProvider.transformResources(input)).toMatchSnapshot()
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

    expect(options.resources).toEqual(I18nProvider.transformResources(resources))
    delete options.resources

    expect(options).toMatchSnapshot()
    i18next.createInstance = unmockedCreateInstance
  })

  it('should fallback to en', () => {
    const component = mount(<I18nProvider setUiDirection={() => {}}>
      <div />
    </I18nProvider>)

    const i18n = component.find(I18nextProvider).prop('i18n')
    expect(i18n.language).toEqual('en')
    expect(component.state()).toEqual({ language: 'en', fonts: { lateef: false, openSans: true, raleway: true } })
  })

  it('should call setLanguage on property change', () => {
    const component = mount(<I18nProvider setUiDirection={() => {}}>
      <div />
    </I18nProvider>)
    component.instance().setLanguage = jest.fn()

    component.setProps({ language: 'de' })
    expect(component.instance().setLanguage).toHaveBeenCalledWith('de')
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

  describe('setLanguage', () => {
    it('should take first i18next language if param is undefined', () => {
      const component = mount(<I18nProvider setUiDirection={() => {}}>
        <div />
      </I18nProvider>)

      const i18n = component.find(I18nextProvider).prop('i18n')

      const expectedLanguage = i18n.languages[0]

      const originalGetSelectedFonts = I18nProvider.getSelectedFonts
      // $FlowFixMe
      I18nProvider.getSelectedFonts = jest.fn(I18nProvider.getSelectedFonts)
      i18n.changeLanguage = jest.fn()

      component.instance().setLanguage()

      // $FlowFixMe
      expect(document.documentElement.lang).toEqual(expectedLanguage)
      expect(i18n.changeLanguage).toHaveBeenCalledWith(expectedLanguage)
      expect(I18nProvider.getSelectedFonts).toHaveBeenCalledWith(expectedLanguage)
      expect(component.state()).toEqual({
        language: expectedLanguage,
        fonts: { lateef: false, openSans: true, raleway: true }
      })
      // $FlowFixMe
      I18nProvider.getSelectedFonts = originalGetSelectedFonts
    })

    it('should take param language if param is defined', () => {
      const component = mount(<I18nProvider setUiDirection={() => {}}>
        <div />
      </I18nProvider>)

      const i18n = component.find(I18nextProvider).prop('i18n')

      const expectedLanguage = 'ar'

      const originalGetSelectedFonts = I18nProvider.getSelectedFonts
      // $FlowFixMe
      I18nProvider.getSelectedFonts = jest.fn(I18nProvider.getSelectedFonts)
      i18n.changeLanguage = jest.fn()

      component.instance().setLanguage(expectedLanguage)

      // $FlowFixMe
      expect(document.documentElement.lang).toEqual(expectedLanguage)
      expect(i18n.changeLanguage).toHaveBeenCalledWith(expectedLanguage)
      expect(I18nProvider.getSelectedFonts).toHaveBeenCalledWith(expectedLanguage)
      expect(component.state()).toEqual({
        language: expectedLanguage,
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
