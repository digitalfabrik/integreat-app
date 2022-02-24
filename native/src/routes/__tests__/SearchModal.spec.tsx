import { fireEvent, render, waitFor } from '@testing-library/react-native'
import React from 'react'
import { ThemeProvider } from 'styled-components/native'

import { CategoriesRouteInformationType, CATEGORIES_ROUTE, SEARCH_FINISHED_SIGNAL_NAME } from 'api-client'
import CategoriesMapModelBuilder from 'api-client/src/testing/CategoriesMapModelBuilder'

import buildConfig from '../../constants/buildConfig'
import { urlFromRouteInformation } from '../../navigation/url'
import sendTrackingSignal from '../../utils/sendTrackingSignal'
import SearchModal from '../SearchModal'

jest.mock('../../utils/sendTrackingSignal')
jest.mock('../../components/TimeStamp')
jest.mock('react-i18next')

describe('SearchModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  const dummy = jest.fn()

  const t = (key: string) => key

  const categoriesMapModel = new CategoriesMapModelBuilder('augsburg', 'de').build()
  const language = 'de'
  const cityCode = 'augsburg'
  const props = {
    categories: categoriesMapModel,
    navigateTo: dummy,
    language,
    cityCode,
    closeModal: dummy,
    navigateToLink: dummy,
    t,
    theme: buildConfig().lightTheme
  }

  it('should send tracking signal when closing search site', async () => {
    const { getByPlaceholderText, getAllByRole } = render(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <SearchModal {...props} />
      </ThemeProvider>
    )
    const goBackButton = getAllByRole('button')[0]!
    const searchBar = getByPlaceholderText('searchPlaceholder')
    await fireEvent.changeText(searchBar, 'Category')
    await fireEvent.press(goBackButton)
    await waitFor(() => expect(goBackButton).not.toBeDisabled())
    await waitFor(() => expect(sendTrackingSignal).toHaveBeenCalledTimes(1))
    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: {
        name: SEARCH_FINISHED_SIGNAL_NAME,
        query: 'Category',
        url: null
      }
    })
  })

  it('should send tracking signal when opening a search result', async () => {
    const { getByText, getByPlaceholderText, getAllByRole } = render(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <SearchModal {...props} />
      </ThemeProvider>
    )
    const goBackButton = getAllByRole('button')[0]!
    const searchBar = getByPlaceholderText('searchPlaceholder')
    await fireEvent.changeText(searchBar, 'Category')
    const categoryListItem = getByText('with id 1')
    await fireEvent.press(categoryListItem)
    await waitFor(() => expect(goBackButton).not.toBeDisabled())
    expect(sendTrackingSignal).toHaveBeenCalledTimes(1)
    const routeInformation: CategoriesRouteInformationType = {
      route: CATEGORIES_ROUTE,
      cityContentPath: categoriesMapModel.toArray()[2]!.path,
      cityCode,
      languageCode: language
    }
    const expectedUrl = urlFromRouteInformation(routeInformation)
    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: {
        name: SEARCH_FINISHED_SIGNAL_NAME,
        query: 'Category',
        url: expectedUrl
      }
    })
  })
})
