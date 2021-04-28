// @flow

import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import SearchModal from '../SearchModal'
import lightTheme from '../../../../modules/theme/constants'
import type { CategoriesRouteInformationType } from 'api-client'
import { CATEGORIES_ROUTE, SEARCH_FINISHED_SIGNAL_NAME } from 'api-client'
import CategoriesMapModelBuilder from 'api-client/src/testing/CategoriesMapModelBuilder'
import sendTrackingSignal from '../../../../modules/endpoint/sendTrackingSignal'
import { urlFromRouteInformation } from '../../../../modules/navigation/url'

// $FlowFixMe
import { ThemeProvider } from 'styled-components/native'

jest.mock('../../../../modules/i18n/NativeLanguageDetector')
jest.mock('rn-fetch-blob')
jest.mock('../../../../modules/endpoint/sendTrackingSignal')

describe('SearchModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const dummy = jest.fn()
  const t = key => key
  const categoriesMapModel = new CategoriesMapModelBuilder('augsburg', 'de').build()
  const language = 'de'
  const cityCode = 'augsburg'
  const props = {
    categories: categoriesMapModel,
    navigateTo: dummy,
    language: language,
    cityCode: cityCode,
    closeModal: dummy,
    navigateToLink: dummy,
    t: t,
    theme: lightTheme,
    sendFeedback: dummy,
    cities: []
  }

  it('should send tracking signal when closing search site', async () => {
    const { getByPlaceholderText, getAllByRole } = render(
      <ThemeProvider theme={lightTheme}>
        <SearchModal {...props} />
      </ThemeProvider>
    )
    const button = getAllByRole('button')[0]
    const searchBar = getByPlaceholderText('searchPlaceholder')
    await fireEvent.changeText(searchBar, 'Category')
    await fireEvent.press(button)

    await waitFor(() => expect(button).not.toBeDisabled())

    expect(sendTrackingSignal).toHaveBeenCalledTimes(1)

    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: { name: SEARCH_FINISHED_SIGNAL_NAME, query: 'Category', url: null }
    })
  })

  it('should send tracking signal when opening a search result', async () => {
    const { getByText, getByPlaceholderText, getAllByRole } = render(
      <ThemeProvider theme={lightTheme}>
        <SearchModal {...props} />
      </ThemeProvider>
    )
    const button = getAllByRole('button')[0]
    const categoryListItem = getByText('Category with id 1')
    const searchBar = getByPlaceholderText('searchPlaceholder')
    await fireEvent.changeText(searchBar, 'Category')
    await fireEvent.press(categoryListItem)
    await waitFor(() => expect(button).not.toBeDisabled())

    expect(sendTrackingSignal).toHaveBeenCalledTimes(1)

    const routeInformation: CategoriesRouteInformationType = {
      route: CATEGORIES_ROUTE,
      cityContentPath: categoriesMapModel.toArray()[2].path,
      cityCode,
      languageCode: language
    }
    const expectedUrl = urlFromRouteInformation(routeInformation)

    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: { name: SEARCH_FINISHED_SIGNAL_NAME, query: 'Category', url: expectedUrl }
    })
  })
})
