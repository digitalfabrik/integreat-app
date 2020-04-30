// @flow

import EndpointBuilder from '../EndpointBuilder'
import type { JsonLocalNewsType } from '../types'
import LocalNewsModel from '../models/LocalNewsModel'
import moment from 'moment-timezone'
import Endpoint from '../Endpoint'

export const LOCALNEWS_ELEMENT_ENDPOINT_NAME = 'newsElement'

type ParamsType = { city: string, language: string, id: string }

// https://cms-dev.integreat-app.de/testumgebung/en/wp-json/extensions/v3/fcm?id=39

export default (
	baseUrl: string
): Endpoint<ParamsType, Array<JsonLocalNewsType>> =>
	new EndpointBuilder(LOCALNEWS_ELEMENT_ENDPOINT_NAME)
		.withParamsToUrlMapper(
			(params: ParamsType): string =>
				`${baseUrl}/${params.city}/${params.language}/wp-json/extensions/v3/fcm?id=${params.id}`
		)
		.withMapper((json: Array<JsonLocalNewsType>): Array<LocalNewsModel> =>
			json.map((localNews: JsonLocalNewsType) => {
				return new LocalNewsModel({
					id: localNews.id,
					timestamp: moment.tz(localNews.timestamp, "GMT"),
					title: localNews.title,
					message: localNews.message,
				});
			})
		)
		.build();
