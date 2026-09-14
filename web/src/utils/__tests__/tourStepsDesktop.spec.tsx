import { TFunction } from 'i18next'

import { LanguageModelBuilder, RegionModel } from 'shared/api'

import buildConfig from '../../constants/buildConfig'
import {
  CHAT_FAB_ELEMENT_ID,
  HEADER_ACTIONS_ELEMENT_ID,
  HEADER_MENU_ELEMENT_ID,
  HEADER_TITLE_ELEMENT_ID,
  NAVIGATION_TABS_ELEMENT_ID,
  TILES_ELEMENT_ID,
  TOOLBAR_ELEMENT_ID,
} from '../../constants/layout'
import tourStepsDesktop from '../tourStepsDesktop'

describe('tourStepsDesktop', () => {
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
    tourStepsDesktop({ t, rtl, region, languageCode: 'de' }).map(step => step.selector)

  it('should show all steps in the order of the tour', () => {
    expect(selectors(createRegion())).toEqual([
      `#${HEADER_TITLE_ELEMENT_ID}`,
      `#${NAVIGATION_TABS_ELEMENT_ID}`,
      `#${TILES_ELEMENT_ID} > :first-child`,
      `#${HEADER_ACTIONS_ELEMENT_ID}`,
      `#${HEADER_MENU_ELEMENT_ID}`,
      `#${CHAT_FAB_ELEMENT_ID}`,
      `#${TOOLBAR_ELEMENT_ID}`,
    ])
  })

  it('should not include the navigation step if the region has no navigation tabs', () => {
    expect(selectors(createRegion({ navigation: false }))).not.toContain(`#${NAVIGATION_TABS_ELEMENT_ID}`)
  })

  it('should not include the chat step if the region has no chat', () => {
    expect(selectors(createRegion({ chat: false }))).not.toContain(`#${CHAT_FAB_ELEMENT_ID}`)
  })

  it('should not include the chat step if the chat is disabled in the build config', () => {
    config.featureFlags.chat = false
    expect(selectors(createRegion())).not.toContain(`#${CHAT_FAB_ELEMENT_ID}`)
    config.featureFlags.chat = true
  })

  it('should not include the change location step if a fixed region is configured', () => {
    config.featureFlags.fixedRegion = 'augsburg'
    expect(selectors(createRegion())).not.toContain(`#${HEADER_TITLE_ELEMENT_ID}`)
    config.featureFlags.fixedRegion = null
  })

  it('should mirror the arrow alignment for right to left languages', () => {
    const [changeLocation] = tourStepsDesktop({ t, rtl: true, region: createRegion(), languageCode: 'de' })

    expect(changeLocation?.arrowAlignment).toBe('right')
  })

  it('should open and close the header menu on the additional features step', () => {
    const menuStep = tourStepsDesktop({ t, rtl: false, region: createRegion(), languageCode: 'de' }).find(
      step => step.selector === `#${HEADER_MENU_ELEMENT_ID}`,
    )
    const button = document.createElement('button')
    const click = jest.spyOn(button, 'click')

    menuStep?.action?.(button)

    expect(click).toHaveBeenCalledTimes(1)

    button.setAttribute('aria-expanded', 'true')
    menuStep?.actionAfter?.(button)

    expect(click).toHaveBeenCalledTimes(2)
  })
})
