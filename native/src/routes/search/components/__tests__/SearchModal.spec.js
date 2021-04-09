// @flow

import React from 'react'
import { fireEvent, render } from '@testing-library/react-native'
import SearchModal from '../SearchModal'
import lightTheme from '../../../../modules/theme/constants'
import type { CategoriesRouteInformationType } from 'api-client'
import { CATEGORIES_ROUTE, SEARCH_FINISHED_SIGNAL_NAME } from 'api-client'
import CategoriesMapModelBuilder from 'api-client/src/testing/CategoriesMapModelBuilder'
import sendTrackingSignal from '../../../../modules/endpoint/sendTrackingSignal'
import { urlFromRouteInformation } from '../../../../modules/navigation/url'

// $FlowFixMe
import { ThemeProvider } from 'styled-components/native'

jest.mock('rn-fetch-blob')
jest.mock('../../../../modules/endpoint/sendTrackingSignal')

describe('SearchModal', () => {
  beforeEach(() => {})

  const dummy = jest.fn()
  const t = key => key
  const categoriesMapModel = new CategoriesMapModelBuilder('augsburg', 'de').build()
  const language = 'de'
  const cityCode = 'augsburg'

  it('search modal should send tracking signal on Press', async () => {
    const { getByText, getByPlaceholderText } = render(
      <ThemeProvider theme={lightTheme}>
        <SearchModal
          categories={categoriesMapModel}
          navigateTo={dummy}
          language={language}
          cityCode={cityCode}
          closeModal={dummy}
          navigateToLink={dummy}
          t={t}
          theme={lightTheme}
          sendFeedback={dummy}
        />
      </ThemeProvider>
    )
    const categoryListItem = getByText('Category with id 1')
    const searchBar = getByPlaceholderText('searchPlaceholder')
    await fireEvent.changeText(searchBar, 'Category')
    await fireEvent.press(categoryListItem)
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
