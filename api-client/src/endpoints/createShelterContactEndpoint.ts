import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'

const SHELTER_CONTACT_URL = 'wohnraum.tuerantuer.org/wp-json/accommodations/contact'

export const SHELTER_CONTACT_ENDPOINT_NAME = 'shelter-contact'
type Params = { id: number; cityCode: string; email?: string; phone?: string }

export type Status = 'success' | 'invalid_contact_data' | 'invalid_accommodation'

export default (): Endpoint<Params, Status> =>
  new EndpointBuilder<Params, Status>(SHELTER_CONTACT_ENDPOINT_NAME)
    .withParamsToUrlMapper(params => `https://${params.cityCode}.${SHELTER_CONTACT_URL}`)
    .withParamsToBodyMapper(({ id, email, phone }: Params): string => JSON.stringify({ id, email, phone }))
    .withMapper((json: { status: Status }): Status => json.status)
    .build()
