// Linkable routes
export type LandingRouteType = 'landing'
export const LANDING_ROUTE: LandingRouteType = 'landing'

export type CityNotCooperatingRouteType = 'recommend'
export const CITY_NOT_COOPERATING_ROUTE: CityNotCooperatingRouteType = 'recommend'

export type CategoriesRouteType = 'categories'
export const CATEGORIES_ROUTE: CategoriesRouteType = 'categories'

export type PoisRouteType = 'locations'
export const POIS_ROUTE: PoisRouteType = 'locations'

export type EventsRouteType = 'events'
export const EVENTS_ROUTE: EventsRouteType = 'events'

export type NewsRouteType = 'news'
export const NEWS_ROUTE: NewsRouteType = 'news'

export type DisclaimerRouteType = 'disclaimer'
export const DISCLAIMER_ROUTE: DisclaimerRouteType = 'disclaimer'

export type SearchRouteType = 'search'
export const SEARCH_ROUTE: SearchRouteType = 'search'

export type JpalTrackingRouteType = 'jpal'
export const JPAL_TRACKING_ROUTE: JpalTrackingRouteType = 'jpal'

export type LicensesRouteType = 'licenses'
export const LICENSES_ROUTE: LicensesRouteType = 'licenses'

// News types
export type LocalNewsType = 'local'
export const LOCAL_NEWS_TYPE: LocalNewsType = 'local'

export type TuNewsType = 'tu-news'
export const TU_NEWS_TYPE: TuNewsType = 'tu-news'

export type NewsType = LocalNewsType | TuNewsType

// Internal native routes
export type RedirectRouteType = 'redirect'
export const REDIRECT_ROUTE: RedirectRouteType = 'redirect'

export type IntroRouteType = 'intro'
export const INTRO_ROUTE: IntroRouteType = 'intro'

export type SettingsRouteType = 'settings'
export const SETTINGS_ROUTE: SettingsRouteType = 'settings'

export type BottomTabNavigationRouteType = 'bottomTabNavigation'
export const BOTTOM_TAB_NAVIGATION_ROUTE: BottomTabNavigationRouteType = 'bottomTabNavigation'

export type ChangeLanguageModalRouteType = 'changeLanguage'
export const CHANGE_LANGUAGE_MODAL_ROUTE: ChangeLanguageModalRouteType = 'changeLanguage'

export type PdfViewModalRouteType = 'pdf'
export const PDF_VIEW_MODAL_ROUTE: PdfViewModalRouteType = 'pdf'

export type ImageViewModalRouteType = 'image'
export const IMAGE_VIEW_MODAL_ROUTE: ImageViewModalRouteType = 'image'

export type FeedbackModalRouteType = 'feedback'
export const FEEDBACK_MODAL_ROUTE: FeedbackModalRouteType = 'feedback'

export type ConsentRouteType = 'consent'
export const CONSENT_ROUTE: ConsentRouteType = 'consent'

// Web routes
export type MainDisclaimerRouteType = 'main-disclaimer'
export const MAIN_DISCLAIMER_ROUTE: MainDisclaimerRouteType = 'main-disclaimer'

export type NotFoundRouteType = 'not-found'
export const NOT_FOUND_ROUTE: NotFoundRouteType = 'not-found'

// Changes done to the reserved routes have to be done in the CMS as well:
// https://github.com/digitalfabrik/integreat-cms/blob/main/integreat_cms/core/settings.py#L69-78
export const RESERVED_TOP_LEVEL_SLUGS: string[] = [
  LANDING_ROUTE,
  MAIN_DISCLAIMER_ROUTE,
  NOT_FOUND_ROUTE,
  CONSENT_ROUTE,
  LICENSES_ROUTE,
  CITY_NOT_COOPERATING_ROUTE,
  JPAL_TRACKING_ROUTE,
]

// Changes done to the reserved routes have to be done in the CMS as well:
// https://github.com/digitalfabrik/integreat-cms/blob/main/integreat_cms/core/settings.py#L80-L88
export const RESERVED_CITY_CONTENT_SLUGS: string[] = [
  SEARCH_ROUTE,
  DISCLAIMER_ROUTE,
  EVENTS_ROUTE,
  NEWS_ROUTE,
  POIS_ROUTE,
]
