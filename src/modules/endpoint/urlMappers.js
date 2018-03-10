import { apiUrl } from './constants'

export const locationUrlMapper = () => `${apiUrl}/wp-json/extensions/v1/multisites`

export const languagesUrlMapper = params => `${apiUrl}/${params.location}/de/wp-json/extensions/v0/languages/wpml`

export const categoriesUrlMapper = params => `${apiUrl}/${params.location}/${params.language}/wp-json/extensions/v0/modified_content/pages?since=1970-01-01T00:00:00Z`

export const eventsUrlMapper = params => `${apiUrl}/${params.location}/${params.language}/wp-json/extensions/v0/modified_content/events?since=1970-01-01T00:00:00Z`

export const extrasUrlMapper = params => `${apiUrl}/${params.location}/${params.language}/wp-json/extensions/v3/extras`

export const disclaimerUrlMapper = params => `${apiUrl}/${params.location}/${params.language}/wp-json/extensions/v0/modified_content/disclaimer?since=1970-01-01T00:00:00Z`

export const sprungbrettUrlMapper = params => params.url
