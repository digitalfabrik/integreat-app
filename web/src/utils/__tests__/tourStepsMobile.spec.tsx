import { TFunction } from 'i18next'

import { LanguageModelBuilder, RegionModel } from 'shared/api'

import buildConfig from '../../constants/buildConfig'
import {
  BOTTOM_NAVIGATION_ELEMENT_ID,
  CHAT_FAB_ELEMENT_ID,
  HEADER_ELEMENT_ID,
  TILES_ELEMENT_ID,
} from '../../constants/layout'
import tourStepsMobile from '../tourStepsMobile'

describe('tourStepsMobile', () => {
  const config = buildConfig()
  const t = ((key: string) => key) as TFunction

  const createRegion = ({ navigation = true, chat = true } = {}) =>
    new RegionModel({
      name: 'Stadt Augsburg',
      code: 'augsburg',
      live: true,
      languages: new LanguageModelBuilder(2).build(),
      eventsEnabled: navigation,
      placesEnabled: navigation,
      localNewsEnabled: navigation,
      externalNewsEnabled: navigation,
      sortingName: 'Augsburg',
      prefix: 'Stadt',
      latitude: 48.369696,
      longitude: 10.892578,
      aliases: {},
      boundingBox: [10.7880103, 48.447238, 11.0174493, 48.297834],
      chatEnabled: chat,
      chatPrivacyPolicyUrl: null,
    })

  const selectors = (region: RegionModel, rtl = false) =>
    tourStepsMobile({ t, rtl, region, languageCode: 'de' }).map(step => step.selector)

  it('should show all steps in the order of the tour', () => {
    expect(selectors(createRegion())).toEqual([
      `#${HEADER_ELEMENT_ID}`,
      `#${HEADER_ELEMENT_ID}`,
      `#${HEADER_ELEMENT_ID}`,
      `#${TILES_ELEMENT_ID} > :first-child`,
      `#${BOTTOM_NAVIGATION_ELEMENT_ID}`,
      `#${CHAT_FAB_ELEMENT_ID}`,
    ])
  })

  it('should not include the navigation step if the region has no navigation tabs', () => {
    expect(selectors(createRegion({ navigation: false }))).not.toContain(`#${BOTTOM_NAVIGATION_ELEMENT_ID}`)
  })

  it('should not include the chat step if the region has no chat', () => {
    expect(selectors(createRegion({ chat: false }))).not.toContain(`#${CHAT_FAB_ELEMENT_ID}`)
  })

  it('should not include the change location step if a fixed region is configured', () => {
    config.featureFlags.fixedRegion = 'augsburg'
    expect(selectors(createRegion())).toHaveLength(5)
    config.featureFlags.fixedRegion = null
  })

  it('should mirror the arrow alignment for right to left languages', () => {
    const [changeLocation] = tourStepsMobile({ t, rtl: true, region: createRegion(), languageCode: 'de' })

    expect(changeLocation?.arrowAlignment).toBe('right')
  })
})
