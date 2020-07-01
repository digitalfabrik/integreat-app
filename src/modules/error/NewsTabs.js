// @flow

import activeInternational from '../../routes/news/assets/tu-news-active.svg'
import inactiveInternational from '../../routes/news/assets/tu-news-inactive.svg'

export const TUNEWS = 'tunews'
export const LOCAL = 'local'

export const LOCAL_NEWS_TAB = {
  type: LOCAL,
  toggleAttrribute: 'pushNotificationsEnabled'
}

export const TUNEWS_TAB = {
  type: TUNEWS,
  active: activeInternational,
  inactive: inactiveInternational,
  toggleAttrribute: 'tunewsEnabled'
}
