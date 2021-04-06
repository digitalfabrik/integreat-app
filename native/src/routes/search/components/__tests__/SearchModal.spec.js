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

jest.mock('rn-fetch-blob')
jest.mock('../../../../modules/endpoint/sendTrackingSignal')

describe('SearchModal', () => {
  beforeEach(() => {})

  const dummy = jest.fn()
  const t = key => key
  const categoriesMapModel = new CategoriesMapModelBuilder('augsburg', 'de').build()
  const language = 'de'
  const cityCode = 'augsburg'

  it('search modal should send tracking signal on Press', () => {
    const { getAllByTestId } = render(
      <SearchModal
        categories={categoriesMapModel}
        navigateTo={dummy}
        theme={lightTheme}
        language={language}
        cityCode={cityCode}
        closeModal={dummy}
        navigateToLink={dummy}
        t={t}
        sendFeedback={dummy}
      />
    )
    const categoryListItem = getAllByTestId('CategoryListItem')[1]
    fireEvent.press(categoryListItem)
    expect(sendTrackingSignal).toHaveBeenCalledTimes(1)

    const routeInformation: CategoriesRouteInformationType = {
      route: CATEGORIES_ROUTE,
      cityContentPath: categoriesMapModel.toArray()[2].path,
      cityCode,
      languageCode: language
    }
    const expectedUrl = urlFromRouteInformation(routeInformation)

    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: { name: SEARCH_FINISHED_SIGNAL_NAME, query: '', url: expectedUrl }
    })
  })
})
