import { mount } from 'enzyme'
import LanguageDetector from 'i18next-browser-languagedetector'
import React from 'react'
import i18next from 'i18next'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import ConnectedI18nProvider, { I18nProvider } from '../I18nProvider'
import { I18nextProvider } from 'react-i18next'
import resources from '../../../../locales.json'

const mockStore = configureMockStore()

describe('I18nProvider', () => {
  it('should match snapshot', () => {
    const component = mount(<I18nProvider>
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
    let i18nInstance
    const unmockedCreateInstance = i18next.createInstance.bind(i18next)
    i18next.createInstance = jest.fn(() => {
      i18nInstance = unmockedCreateInstance()
      i18nInstance.init = jest.fn(i18nInstance.init)
      i18nInstance.use = jest.fn(i18nInstance.use)
      return i18nInstance
    })

    const component = mount(<I18nProvider>
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
    const component = mount(<I18nProvider>
      <div />
    </I18nProvider>)

    const i18n = component.find(I18nextProvider).prop('i18n')
    expect(i18n.language).toEqual('en')
    expect(component.state()).toEqual({language: 'en'})
  })

  it('should call setLanguage on property change', () => {
    I18nProvider.prototype.setLanguage = jest.fn(I18nProvider.prototype.setLanguage)
    const component = mount(<I18nProvider>
      <div />
    </I18nProvider>)
    expect(I18nProvider.prototype.setLanguage).toHaveBeenCalledWith(undefined)

    component.setProps({language: 'de'})
    expect(I18nProvider.prototype.setLanguage).toHaveBeenCalledWith('de')
  })

  it('should connect to the store', () => {
    const store = mockStore({location: {payload: {language: 'language1'}}})
    const i18n = mount(<Provider store={store}>
      <ConnectedI18nProvider>
        <div />
      </ConnectedI18nProvider>
    </Provider>)

    expect(i18n.find(I18nProvider).props()).toMatchSnapshot()
  })

  describe('setLanguage', () => {
    it('should take first i18next language if param is undefined', () => {
      const component = mount(<I18nProvider>
        <div />
      </I18nProvider>)

      const i18n = component.find(I18nextProvider).prop('i18n')
      const instance = component.instance()

      const expectedLanguage = i18n.languages[0]

      instance.loadFonts = jest.fn()
      i18n.changeLanguage = jest.fn()

      component.instance().setLanguage()

      expect(document.documentElement.lang).toEqual(expectedLanguage)
      expect(i18n.changeLanguage).toHaveBeenCalledWith(expectedLanguage)
      expect(instance.loadFonts).toHaveBeenCalledWith(expectedLanguage)
      expect(component.state()).toEqual({language: expectedLanguage})
    })

    it('should ignore invalid languages', () => {
      const tree = mount(<I18nProvider>
        <div />
      </I18nProvider>)

      const i18n = tree.find(I18nextProvider).prop('i18n')

      const expectedLanguage = i18n.languages[0]

      tree.instance().setLanguage('long string')

      expect(document.documentElement.lang).toEqual(expectedLanguage)
    })

    it('should take param language if param is defined', () => {
      const component = mount(<I18nProvider>
        <div />
      </I18nProvider>)

      const i18n = component.find(I18nextProvider).prop('i18n')
      const instance = component.instance()

      const expectedLanguage = 'ar'

      instance.loadFonts = jest.fn()
      i18n.changeLanguage = jest.fn()

      component.instance().setLanguage(expectedLanguage)

      expect(document.documentElement.lang).toEqual(expectedLanguage)
      expect(i18n.changeLanguage).toHaveBeenCalledWith(expectedLanguage)
      expect(instance.loadFonts).toHaveBeenCalledWith(expectedLanguage)
      expect(component.state()).toEqual({language: expectedLanguage})
    })
  })

  it('should add direction style depending on language', () => {
    const component = mount(<I18nProvider language='en'>
      <div />
    </I18nProvider>)
    expect(component.find('div').at(0).prop('style').direction).toEqual('ltr')
    component.setProps({language: 'ar'})
    expect(component.find('div').at(0).prop('style').direction).toEqual('rtl')
  })
})
