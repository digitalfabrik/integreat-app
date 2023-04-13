import { fireEvent, waitFor } from '@testing-library/react-native'
import React from 'react'
import { CATEGORIES_ROUTE, CategoriesRouteInformationType, SEARCH_FINISHED_SIGNAL_NAME } from 'api-client'
import CategoriesMapModelBuilder from 'api-client/src/testing/CategoriesMapModelBuilder'

import buildConfig from '../../constants/buildConfig'
import { urlFromRouteInformation } from '../../navigation/url'
import render from '../../testing/render'
import sendTrackingSignal from '../../utils/sendTrackingSignal'
import SearchModal from '../SearchModal'

jest.mock('../../utils/sendTrackingSignal')
jest.mock('../../components/FeedbackContainer')
jest.mock('../../components/TimeStamp')
jest.mock('../../hooks/useResourceCache', () => () => ({}))
jest.mock('react-i18next')

describe('SearchModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  const dummy = jest.fn()

  const t = (key: string) => key

  const categoriesMapModel = new CategoriesMapModelBuilder('augsburg', 'de', 2, 2).build()
  const languageCode = 'de'
  const cityCode = 'augsburg'
  const props = {
    categories: categoriesMapModel,
    navigateTo: dummy,
    languageCode,
    cityCode,
    closeModal: dummy,
    navigateToLink: dummy,
    t,
    theme: buildConfig().lightTheme,
  }

  it('should send tracking signal when closing search site', async () => {
    const { getByPlaceholderText, getAllByRole } = render(<SearchModal {...props} />)
    const goBackButton = getAllByRole('button')[0]!
    const searchBar = getByPlaceholderText('searchPlaceholder')
    fireEvent.changeText(searchBar, 'Category')
    fireEvent.press(goBackButton)
    await waitFor(() => expect(goBackButton).not.toBeDisabled())
    await waitFor(() => expect(sendTrackingSignal).toHaveBeenCalledTimes(1))
    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: {
        name: SEARCH_FINISHED_SIGNAL_NAME,
        query: 'Category',
        url: null,
      },
    })
  })

  it('should send tracking signal when opening a search result', async () => {
    const { getByText, getByPlaceholderText, getAllByRole } = render(<SearchModal {...props} />)
    const goBackButton = getAllByRole('button')[0]!
    const searchBar = getByPlaceholderText('searchPlaceholder')
    fireEvent.changeText(searchBar, 'Category')
    const categoryListItem = getByText('with id 1', { exact: false })
    fireEvent.press(categoryListItem)
    await waitFor(() => expect(goBackButton).not.toBeDisabled())
    expect(sendTrackingSignal).toHaveBeenCalledTimes(1)
    const routeInformation: CategoriesRouteInformationType = {
      route: CATEGORIES_ROUTE,
      cityContentPath: categoriesMapModel.toArray()[2]!.path,
      cityCode,
      languageCode,
    }
    const expectedUrl = urlFromRouteInformation(routeInformation)
    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: {
        name: SEARCH_FINISHED_SIGNAL_NAME,
        query: 'Category',
        url: expectedUrl,
      },
    })
  })

  it('should show nothing found if there are no search results', () => {
    const { getByText, getByPlaceholderText } = render(<SearchModal {...props} />)

    fireEvent.changeText(getByPlaceholderText('searchPlaceholder'), 'invalid query')

    expect(getByText('search:nothingFound')).toBeTruthy()
  })
})
