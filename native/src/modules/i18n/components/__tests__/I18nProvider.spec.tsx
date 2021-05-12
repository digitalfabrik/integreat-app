import React, { useContext } from 'react'
import { Translation } from 'react-i18next'
import { Text } from 'react-native'
import NativeLanguageDetector from '../../NativeLanguageDetector'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import { render, waitFor } from '@testing-library/react-native'
import I18nProvider from '../I18nProvider'
import { CitiesStateType, LanguagesStateType, StateType } from '../../../app/StateType'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'
import LanguageModelBuilder from 'api-client/src/testing/LanguageModelBuilder'
import AppSettings from '../../../settings/AppSettings'
import AsyncStorage from '@react-native-community/async-storage'
import DateFormatterContext from '../../context/DateFormatterContext'
import moment from 'moment'
import { setSystemLanguage } from '../../../endpoint/sendTrackingSignal'

jest.mock('../../NativeLanguageDetector')
jest.mock('translations/src/loadTranslations')
jest.mock('../../../endpoint/sendTrackingSignal')

const cities = new CityModelBuilder(1).build()
const city = cities[0]
const languages = new LanguageModelBuilder(1).build()
const language = languages[0]

const prepareState = ({
  contentLanguage = 'de',
  switchingLanguage,
  cities,
  languages
}: {
  contentLanguage?: string
  switchingLanguage?: boolean
  cities?: CitiesStateType
  languages?: LanguagesStateType
} = {}): StateType => {
  return {
    darkMode: false,
    resourceCacheUrl: 'http://localhost:8080',
    cityContent: {
      city: city.code,
      switchingLanguage: switchingLanguage !== undefined ? switchingLanguage : false,
      languages: languages || {
        status: 'ready',
        models: [language]
      },
      routeMapping: {},
      searchRoute: null,
      resourceCache: {
        status: 'ready',
        progress: 0,
        value: {
          file: {}
        }
      }
    },
    contentLanguage,
    cities: cities || {
      status: 'ready',
      models: [city]
    },
    snackbar: []
  }
}

const mockStore = configureMockStore()
const mockDetect = (NativeLanguageDetector.detect as unknown) as jest.Mock

describe('I18nProvider', () => {
  beforeEach(async () => {
    await AsyncStorage.clear()
    jest.clearAllMocks()
  })

  it('should set content language if not yet set', async () => {
    mockDetect.mockReturnValue(['kmr'])
    const store = mockStore(prepareState())
    render(
      <Provider store={store}>
        <I18nProvider>
          <Text>Hello</Text>
        </I18nProvider>
      </Provider>
    )
    await waitFor(() => {})
    expect(await new AppSettings().loadContentLanguage()).toEqual('kmr')
    expect(setSystemLanguage).toHaveBeenCalledTimes(1)
    expect(setSystemLanguage).toHaveBeenCalledWith('kmr')
  })

  it('should show error if loading fails', async () => {
    mockDetect.mockImplementation(() => {
      throw Error('An Error occurred while getting settings!')
    })
    const store = mockStore(prepareState())
    const { getByText } = render(
      <Provider store={store}>
        <I18nProvider>
          <></>
        </I18nProvider>
      </Provider>
    )
    await waitFor(() => getByText('An Error occurred while getting settings!'))
    expect(getByText('An Error occurred while getting settings!')).toBeTruthy()
    mockDetect.mockRestore()
  })

  it('should use fallbacks for ui translations', async () => {
    mockDetect.mockReturnValue(['ku'])
    const store = mockStore(prepareState())
    const { getByText } = render(
      <Provider store={store}>
        <I18nProvider>
          <Translation>{(t, { i18n }) => <Text>{t('dashboard:localInformation')}</Text>}</Translation>
        </I18nProvider>
      </Provider>
    )
    await waitFor(() => expect(getByText('Zanyariyên xwecihî')).toBeTruthy())
  })

  it('should choose the default fallback for ui translations', async () => {
    mockDetect.mockReturnValue(['en'])
    const store = mockStore(prepareState())
    const { getByText } = render(
      <Provider store={store}>
        <I18nProvider>
          <Translation>{(t, { i18n }) => <Text>{t('dashboard:localInformation')}</Text>}</Translation>
        </I18nProvider>
      </Provider>
    )
    await waitFor(() => getByText('Lokale Informationen'))
    expect(getByText('Lokale Informationen')).toBeTruthy()
  })

  it('should dispatch content language', async () => {
    await new AppSettings().setContentLanguage('ar')
    const store = mockStore(prepareState())
    render(
      <Provider store={store}>
        <I18nProvider>
          <Text>Hello</Text>
        </I18nProvider>
      </Provider>
    )
    await waitFor(() =>
      expect(store.getActions()).toEqual([
        {
          params: {
            contentLanguage: 'ar'
          },
          type: 'SET_CONTENT_LANGUAGE'
        }
      ])
    )
  })

  it('should have formatter with german fallback format', async () => {
    const store = mockStore(prepareState())

    const ReceivingComponent = () => {
      const formatter = useContext(DateFormatterContext)
      const formated = formatter.format(moment.utc('2020-12-21T14:58:57+01:00'), {})
      return <Text>{formated}</Text>
    }

    const { getByText } = render(
      <Provider store={store}>
        <I18nProvider>
          <ReceivingComponent />
        </I18nProvider>
      </Provider>
    )
    await waitFor(() => getByText('2020-12-21T13:58:57Z'))
    expect(getByText('2020-12-21T13:58:57Z')).toBeTruthy()
  })

  it('should have content language set when rendering children', async () => {
    await new AppSettings().setContentLanguage('kmr')
    const store = mockStore(
      prepareState({
        contentLanguage: undefined
      })
    )

    const ReceivingComponent = () => {
      expect(store.getActions()).toEqual([
        {
          params: {
            contentLanguage: 'kmr'
          },
          type: 'SET_CONTENT_LANGUAGE'
        }
      ])
      return <Text>Hello</Text>
    }

    const { getByText } = render(
      <Provider store={store}>
        <I18nProvider>
          <ReceivingComponent />
        </I18nProvider>
      </Provider>
    )
    await waitFor(() => getByText('Hello'))
  })

  it('should use zh-CN if any chinese variant is chosen', async () => {
    mockDetect.mockReturnValue(['zh-CN'])
    const store = mockStore(prepareState())
    const { getByText } = render(
      <Provider store={store}>
        <I18nProvider>
          <Translation>{(t, { i18n }) => <Text>{t('dashboard:localInformation')}</Text>}</Translation>
        </I18nProvider>
      </Provider>
    )
    await waitFor(() => getByText('本地信息'))
    expect(getByText('本地信息')).toBeTruthy()
  })

  it('should support language tags with dashes', async () => {
    mockDetect.mockReturnValue(['zh-hans'])
    const store = mockStore(prepareState())
    const { getByText } = render(
      <Provider store={store}>
        <I18nProvider>
          <Translation>{(t, { i18n }) => <Text>{t('dashboard:localInformation')}</Text>}</Translation>
        </I18nProvider>
      </Provider>
    )
    await waitFor(() => getByText('本地信息'))
    expect(getByText('本地信息')).toBeTruthy()
  })

  it('should support de-DE and select de', async () => {
    mockDetect.mockReturnValue(['de-DE'])
    const store = mockStore(prepareState())
    const { getByText, queryByText } = render(
      <Provider store={store}>
        <I18nProvider>
          <Translation>{(t, { i18n }) => <Text>{t('dashboard:localInformation')}</Text>}</Translation>
          <Translation>{(t, { i18n }) => <Text>{i18n.languages[0]}</Text>}</Translation>
        </I18nProvider>
      </Provider>
    )
    await waitFor(() => getByText('Lokale Informationen'))
    expect(getByText('Lokale Informationen')).toBeTruthy()
    expect(getByText('de')).toBeTruthy()
    expect(queryByText('de-DE')).toBeFalsy()
  })
})
