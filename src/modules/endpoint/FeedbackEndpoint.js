// @flow

import type { MapParamsToUrlType } from './MapParamsToUrlType'
import type { MapParamsToBodyType } from './MapParamsToBodyType'
import LoadingError from './errors/LoadingError'
import ParamMissingError from './errors/ParamMissingError'

class FeedbackEndpoint<Params> {
  name: string
  mapParamsToUrl: MapParamsToUrlType<Params>
  mapParamsToBody: MapParamsToBodyType<Params>

  constructor (name: string, mapParamsToUrl: MapParamsToUrlType<Params>,
    mapParamsToBody: MapParamsToBodyType<Params>) {
    this.name = name
    this.mapParamsToUrl = mapParamsToUrl
    this.mapParamsToBody = mapParamsToBody
  }

  async postData (params: Params): Promise<void> {
    try {
      const formattedUrl = this.mapParamsToUrl(params)
      const formattedBody = this.mapParamsToBody(params)

      const response = await fetch(formattedUrl, {
        method: 'POST',
        body: formattedBody
      })

      if (!response.ok) {
        throw new LoadingError({endpointName: this.name, message: `${response.status}`})
      }
    } catch (e) {
      let error
      if (e instanceof LoadingError || e instanceof ParamMissingError) {
        error = e
      } else {
        error = new LoadingError({endpointName: this.name, message: e.message})
      }
      console.error(error)
    }
  }
}

export default FeedbackEndpoint
