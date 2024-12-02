import { fireEvent } from '@testing-library/react'
import React, { ReactElement } from 'react'

import { CATEGORIES_ROUTE } from 'shared'

import { renderWithRouterAndTheme } from '../../testing/render'
import FeedbackToolbarIcons from '../FeedbackToolbarIcons'

jest.mock('react-i18next')
jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  createFeedbackEndpoint: () => ({
    request: () => undefined,
  }),
}))
jest.mock('focus-trap-react', () => ({ children }: { children: ReactElement }) => <div>{children}</div>)

describe('FeedbackToolbarIcons', () => {
  it('should open and update title on submit feedback', async () => {
    const { queryByText, findByText, getByText } = renderWithRouterAndTheme(
      <FeedbackToolbarIcons route={CATEGORIES_ROUTE} slug='my-slug' />,
    )

    expect(queryByText('feedback:headline')).toBeFalsy()
    expect(queryByText('feedback:thanksHeadline')).toBeFalsy()

    fireEvent.click(getByText('feedback:useful'))

    expect(getByText('feedback:headline')).toBeTruthy()
    expect(queryByText('feedback:thanksHeadline')).toBeFalsy()

    fireEvent.click(getByText('feedback:send'))

    expect(await findByText('feedback:thanksMessage')).toBeTruthy()
    expect(queryByText('feedback:headline')).toBeFalsy()
    expect(getByText('feedback:thanksHeadline')).toBeTruthy()

    fireEvent.click(getByText('feedback:common:close'))

    expect(queryByText('feedback:headline')).toBeFalsy()
    expect(queryByText('feedback:thanksHeadline')).toBeFalsy()
  })
})
