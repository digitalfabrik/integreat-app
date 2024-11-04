import { render } from '@testing-library/react'
import { DateTime } from 'luxon'
import React from 'react'

import { MALTE_HELP_FORM_OFFER_ALIAS, SPRUNGBRETT_OFFER_ALIAS } from 'shared'
import { CategoryModel, OfferModel } from 'shared/api'

import EmbeddedOffers from '../EmbeddedOffers'

jest.mock('../SprungbrettOffer', () => {
  const MockedSprungbrettOffer = ({ sprungbrettOffer }: { sprungbrettOffer: OfferModel }) => (
    <div>This is the Sprungbrett offer called {sprungbrettOffer.title}</div>
  )
  return MockedSprungbrettOffer
})

jest.mock('../MalteHelpForm', () => {
  const MockedMalteHelpForm = ({ malteHelpFormOffer }: { malteHelpFormOffer: OfferModel }) => (
    <div>This is the Malte help form called {malteHelpFormOffer.title}</div>
  )
  return MockedMalteHelpForm
})

describe('EmbeddedOffers', () => {
  const createCategory = (offer: OfferModel) =>
    new CategoryModel({
      root: false,
      path: '/augsburg/de/title',
      title: 'Title',
      content: '',
      parentPath: '/augsburg/de',
      order: 75,
      availableLanguages: {},
      thumbnail: '',
      lastUpdate: DateTime.fromISO('2024-08-15T10:47:34+02:00'),
      organization: null,
      embeddedOffers: [offer],
    })

  const renderEmbeddedOffers = (category: CategoryModel) =>
    render(
      <EmbeddedOffers
        category={category}
        city={null}
        pathname='/augsburg/de/title'
        cityCode='augsburg'
        languageCode='de'
      />,
    )

  it('should render a Sprungbrett offer correctly', () => {
    const offer = new OfferModel({
      alias: SPRUNGBRETT_OFFER_ALIAS,
      path: '/augsburg/de/title',
      thumbnail: '',
      title: 'Offer 1',
    })
    const category = createCategory(offer)
    const { queryByText } = renderEmbeddedOffers(category)

    expect(queryByText('This is the Sprungbrett offer called Offer 1')).toBeTruthy()
    expect(queryByText('This is the Malte help form called Offer 1')).toBeNull()
  })

  it('should render a Malte help form correctly', () => {
    const offer = new OfferModel({
      alias: MALTE_HELP_FORM_OFFER_ALIAS,
      path: '/augsburg/de/title',
      thumbnail: '',
      title: 'Offer 2',
    })
    const category = createCategory(offer)
    const { queryByText } = renderEmbeddedOffers(category)

    expect(queryByText('This is the Malte help form called Offer 2')).toBeTruthy()
    expect(queryByText('This is the Sprungbrett offer called Offer 2')).toBeNull()
  })
})
