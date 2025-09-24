import { fireEvent } from '@testing-library/react'
import React, { ReactElement } from 'react'

import { CATEGORIES_ROUTE, RATING_POSITIVE } from 'shared'

import { renderWithRouterAndTheme } from '../../testing/render'
import FeedbackToolbarItem from '../FeedbackToolbarItem'

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: (namespace?: string) => ({
    t: (key: string) => (namespace ? `${namespace}:${key}` : key),
  }),
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
}))
jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  createFeedbackEndpoint: () => ({
    request: () => undefined,
  }),
}))
jest.mock('focus-trap-react', () => ({ children }: { children: ReactElement }) => <div>{children}</div>)

describe('FeedbackToolbarItem', () => {
  it('should open and update title on submit feedback', async () => {
    const { queryByText, findByText, getByText } = renderWithRouterAndTheme(
      <FeedbackToolbarItem route={CATEGORIES_ROUTE} slug='my-slug' rating={RATING_POSITIVE} />,
    )

    expect(queryByText('feedback:headline')).toBeFalsy()
    expect(queryByText('feedback:thanksHeadline')).toBeFalsy()

    fireEvent.click(getByText('feedback:useful'))

    expect(getByText('feedback:headline')).toBeTruthy()
    expect(queryByText('feedback:thanksHeadline')).toBeFalsy()

    getByText('common:privacyPolicy').click()

    fireEvent.click(getByText('feedback:send'))

    expect(await findByText('feedback:thanksMessage')).toBeTruthy()
    expect(queryByText('feedback:headline')).toBeFalsy()
    expect(getByText('feedback:thanksHeadline')).toBeTruthy()
  })
})
