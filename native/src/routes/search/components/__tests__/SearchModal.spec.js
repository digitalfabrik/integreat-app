// @flow

import React from 'react'
import { fireEvent, render } from '@testing-library/react-native'
import SearchModal from '../SearchModal'
import lightTheme from '../../../../modules/theme/constants'
import { SEARCH_FINISHED_SIGNAL_NAME } from 'api-client'
import CategoriesMapModelBuilder from 'api-client/src/testing/CategoriesMapModelBuilder'
import sendTrackingSignal from '../../../../modules/endpoint/sendTrackingSignal'

jest.mock('rn-fetch-blob')
jest.mock('../../../../modules/endpoint/sendTrackingSignal')

describe('SearchModal', () => {
  beforeEach(() => {})

  const dummy = jest.fn()
  const t = key => key
  const categoriesMapModel = new CategoriesMapModelBuilder('augsburg', 'de').build()

  it('search modal should send tracking signal on Press', () => {
    const { getAllByTestId } = render(
      <SearchModal
        categories={categoriesMapModel}
        navigateTo={dummy}
        theme={lightTheme}
        language={'de'}
        cityCode={'augsburg'}
        closeModal={dummy}
        navigateToLink={dummy}
        t={t}
        sendFeedback={dummy}
      />
    )
    const categoryListItem = getAllByTestId('CategoryListItem')[1]
    fireEvent.press(categoryListItem)
    expect(sendTrackingSignal).toHaveBeenCalledTimes(1)
    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: { name: SEARCH_FINISHED_SIGNAL_NAME, query: '', url: Array.from(categoriesMapModel._categories)[2][0] }
    })
  })
})
