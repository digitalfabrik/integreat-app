import React, { ReactElement } from 'react'

import { LanguageModelBuilder, RegionModel } from 'shared/api'

import buildConfig from '../../constants/buildConfig'
import {
  BOTTOM_NAVIGATION_ELEMENT_ID,
  CHAT_FAB_ELEMENT_ID,
  HEADER_ACTIONS_ELEMENT_ID,
  HEADER_ELEMENT_ID,
  HEADER_MENU_ELEMENT_ID,
  HEADER_TITLE_ELEMENT_ID,
  NAVIGATION_TABS_ELEMENT_ID,
  TILES_ELEMENT_ID,
  TOOLBAR_ELEMENT_ID,
} from '../../constants/layout'
import { renderWithTheme } from '../../testing/render'
import useTourSteps from '../useTourSteps'

jest.mock('react-i18next')

describe('useTourSteps', () => {
  const config = buildConfig()

  const createRegion = ({ navigation = true, chat = true } = {}) =>
    new RegionModel({
      name: 'Stadt Augsburg',
      code: 'augsburg',
      live: true,
      languages: new LanguageModelBuilder(2).build(),
      eventsEnabled: navigation,
      placesEnabled: navigation,
      localNewsEnabled: navigation,
      tuNewsEnabled: navigation,
      sortingName: 'Augsburg',
      prefix: 'Stadt',
      latitude: 48.369696,
      longitude: 10.892578,
      aliases: {},
      boundingBox: [10.7880103, 48.447238, 11.0174493, 48.297834],
      chatEnabled: chat,
      chatPrivacyPolicyUrl: null,
    })

  const MockComponent = ({ region, desktop }: { region: RegionModel; desktop: boolean }): ReactElement => {
    const steps = useTourSteps({ region, languageCode: 'de', desktop })
    return (
      <ul>
        {steps.map((step, index) => (
          <li key={String(step.selector.toString() + index)}>{String(step.selector)}</li>
        ))}
      </ul>
    )
  }

  const renderSelectors = (region: RegionModel, desktop = true) =>
    renderWithTheme(<MockComponent region={region} desktop={desktop} />)
      .getAllByRole('listitem')
      .map(item => item.textContent)

  it('should show all steps in the order of the tour on desktop', () => {
    expect(renderSelectors(createRegion())).toEqual([
      `#${HEADER_TITLE_ELEMENT_ID}`,
      `#${NAVIGATION_TABS_ELEMENT_ID}`,
      `#${TILES_ELEMENT_ID} > :first-child`,
      `#${HEADER_ACTIONS_ELEMENT_ID}`,
      `#${HEADER_MENU_ELEMENT_ID}`,
      `#${CHAT_FAB_ELEMENT_ID}`,
      `#${TOOLBAR_ELEMENT_ID}`,
    ])
  })

  it('should show all steps in the order of the tour on mobile', () => {
    expect(renderSelectors(createRegion(), false)).toEqual([
      `#${HEADER_ELEMENT_ID}`,
      `#${HEADER_ELEMENT_ID}`,
      `#${HEADER_ELEMENT_ID}`,
      `#${TILES_ELEMENT_ID} > :first-child`,
      `#${BOTTOM_NAVIGATION_ELEMENT_ID}`,
      `#${CHAT_FAB_ELEMENT_ID}`,
    ])
  })

  it('should omit the navigation step if the region has no navigation tabs', () => {
    expect(renderSelectors(createRegion({ navigation: false }))).not.toContain(`#${NAVIGATION_TABS_ELEMENT_ID}`)
  })

  it('should omit the chat step if the region has no chat', () => {
    expect(renderSelectors(createRegion({ chat: false }))).not.toContain(`#${CHAT_FAB_ELEMENT_ID}`)
  })

  it('should omit the chat step if the chat is disabled in the build config', () => {
    config.featureFlags.chat = false
    expect(renderSelectors(createRegion())).not.toContain(`#${CHAT_FAB_ELEMENT_ID}`)
    config.featureFlags.chat = true
  })

  it('should omit the change location step if a fixed region is configured', () => {
    config.featureFlags.fixedRegion = 'augsburg'
    expect(renderSelectors(createRegion())).not.toContain(`#${HEADER_TITLE_ELEMENT_ID}`)
    config.featureFlags.fixedRegion = null
  })
})
