import React from 'react'
import { render } from '@testing-library/react'
import moment from 'moment'
import DisclaimerPage from '../DisclaimerPage'
import { PageModel } from 'api-client'
import CityModelBuilder from '../../../../api-client/src/testing/CityModelBuilder'
import LanguageModelBuilder from '../../../../api-client/src/testing/LanguageModelBuilder'
import { renderWithRouter } from '../../testing/render'
import { Route } from 'react-router-dom'

describe('DisclaimerPage', () => {
  const languages = new LanguageModelBuilder(2).build()
  const cities = new CityModelBuilder(2).build()
  const disclaimer = new PageModel({
    path: '/disclaimer',
    title: 'Feedback, Kontakt und mögliches Engagement',
    content: 'this is a test content',
    lastUpdate: moment('2017-11-18T19:30:00.000Z'),
    hash: '2fe6283485a93932'
  })

  it('should match snapshot', () => {
    const city = cities[0]
    const language = languages[0]
    const { getByText } = renderWithRouter(
      <Route
        render={props => (
          <DisclaimerPage
            cities={cities}
            cityModel={city}
            languages={languages}
            languageModel={language}
            disclaimer={disclaimer}
            {...props}
          />
        )}
      />
    )
    expect(getByText(disclaimer.title)).toBeTruthy()
    expect(getByText(disclaimer.content)).toBeTruthy()
  })
})
