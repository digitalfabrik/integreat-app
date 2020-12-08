// @flow

import { createNavigateToInternalLink } from '../createNavigateToInternalLink'

const instantiate = () => {
  const mocks = {
    navigateToLanding: jest.fn(),
    navigateToEvent: jest.fn(),
    navigateToCategory: jest.fn(),
    navigateToDashboard: jest.fn()
  }
  const navigateToInternalLink = createNavigateToInternalLink(mocks)
  return { navigateToInternalLink, mocks }
}

const expectExactlyOneHit = (mocks: {
  navigateToLanding: JestMockFn<*, *>,
  navigateToEvent: JestMockFn<*, *>,
  navigateToCategory: JestMockFn<*, *>,
  navigateToDashboard: JestMockFn<*, *>
}) => {
  expect([
    ...mocks.navigateToLanding.mock.calls,
    ...mocks.navigateToEvent.mock.calls,
    ...mocks.navigateToCategory.mock.calls,
    ...mocks.navigateToDashboard.mock.calls
  ]).toHaveLength(1)
}

describe('createNavigateToInternalLink', () => {
  it('should navigate to Landing', () => {
    const { navigateToInternalLink, mocks } = instantiate()
    navigateToInternalLink({ url: 'https://integreat.app', language: 'en' })

    expect(mocks.navigateToLanding).toHaveBeenCalled()
    expectExactlyOneHit(mocks)
  })

  it('should navigate to Dashboard with current language if url only contains city', () => {
    const { navigateToInternalLink, mocks } = instantiate()
    navigateToInternalLink({ url: 'https://integreat.app/augsburg', language: 'en' })

    expect(mocks.navigateToDashboard).toHaveBeenCalledWith({
      cityCode: 'augsburg',
      language: 'en',
      path: '/augsburg/en'
    })
    expectExactlyOneHit(mocks)
  })

  it('should navigate to Dashboard if url only contains city and language', () => {
    const { navigateToInternalLink, mocks } = instantiate()
    navigateToInternalLink({ url: 'https://integreat.app/augsburg/de', language: 'en' })

    expect(mocks.navigateToDashboard).toHaveBeenCalledWith({
      cityCode: 'augsburg',
      language: 'de',
      path: '/augsburg/de'
    })
    expectExactlyOneHit(mocks)
  })

  it('should navigate to Category if url only matches a subcategory', () => {
    const { navigateToInternalLink, mocks } = instantiate()
    navigateToInternalLink({ url: 'https://integreat.app/augsburg/de/sub-category', language: 'en' })

    expect(mocks.navigateToCategory).toHaveBeenCalledWith({
      cityCode: 'augsburg',
      language: 'de',
      path: '/augsburg/de/sub-category'
    })
    expectExactlyOneHit(mocks)
  })

  it('should navigate to events', () => {
    const { navigateToInternalLink, mocks } = instantiate()
    navigateToInternalLink({ url: 'https://integreat.app/augsburg/de/events', language: 'en' })

    expect(mocks.navigateToEvent).toHaveBeenCalledWith({
      cityCode: 'augsburg',
      language: 'de',
      path: null
    })
    expectExactlyOneHit(mocks)
  })

  it('should navigate to a special event', () => {
    const { navigateToInternalLink, mocks } = instantiate()
    navigateToInternalLink({ url: 'https://integreat.app/augsburg/de/events/integrationskurs', language: 'en' })

    expect(mocks.navigateToEvent).toHaveBeenCalledWith({
      cityCode: 'augsburg',
      language: 'de',
      path: '/augsburg/de/events/integrationskurs'
    })
    expectExactlyOneHit(mocks)
  })
})
