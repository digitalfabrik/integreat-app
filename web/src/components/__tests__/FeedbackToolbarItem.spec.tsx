import { fireEvent } from '@testing-library/react'
import React, { ReactElement } from 'react'

import { CATEGORIES_ROUTE } from 'api-client'

import { renderWithRouterAndTheme } from '../../testing/render'
import FeedbackToolbarItem from '../FeedbackToolbarItem'

jest.mock('react-i18next')
jest.mock('api-client', () => ({
  ...jest.requireActual('api-client'),
  createFeedbackEndpoint: () => ({
    request: () => undefined,
  }),
}))
jest.mock('focus-trap-react', () => ({ children }: { children: ReactElement }) => <div>{children}</div>)

describe('FeedbackToolbarItem', () => {
  it('should open and update title on submit feedback', async () => {
    const { queryByText, findByText, getByText } = renderWithRouterAndTheme(
      <FeedbackToolbarItem route={CATEGORIES_ROUTE} slug='my-slug' isInBottomActionSheet={false} />
    )

    expect(queryByText('feedback:headline')).toBeFalsy()
    expect(queryByText('feedback:thanksHeadline')).toBeFalsy()

    fireEvent.click(getByText('feedback:feedback'))

    expect(getByText('feedback:headline')).toBeTruthy()
    expect(queryByText('feedback:thanksHeadline')).toBeFalsy()

    fireEvent.click(getByText('feedback:useful'))
    fireEvent.click(getByText('feedback:send'))

    expect(await findByText('feedback:thanksMessage')).toBeTruthy()
    expect(queryByText('feedback:headline')).toBeFalsy()
    expect(getByText('feedback:thanksHeadline')).toBeTruthy()

    fireEvent.click(getByText('feedback:common:close'))

    expect(queryByText('feedback:headline')).toBeFalsy()
    expect(queryByText('feedback:thanksHeadline')).toBeFalsy()
  })
})
