import { DateTime } from 'luxon'

import CategoryModel from '../models/CategoryModel.js'
import OfferModel from '../models/OfferModel.js'
import OrganizationModel from '../models/OrganizationModel.js'
import { JsonCategoryType } from '../types.js'
import mapAvailableLanguages from './mapAvailableLanguages.js'

const mapCategoryJson = (json: JsonCategoryType, basePath: string): CategoryModel =>
  new CategoryModel({
    root: false,
    path: json.path,
    title: json.title,
    content: json.content,
    thumbnail: json.thumbnail,
    order: json.order,
    availableLanguages: mapAvailableLanguages(json.available_languages),
    parentPath: json.parent.path || basePath,
    lastUpdate: DateTime.fromISO(json.last_updated),
    organization: json.organization
      ? new OrganizationModel({
          name: json.organization.name,
          url: json.organization.website,
          logo: json.organization.logo,
        })
      : null,
    embeddedOffers: json.embedded_offers.map(
      offer =>
        new OfferModel({
          alias: offer.alias,
          title: offer.name,
          path: offer.post?.['zammad-url'] ?? offer.url,
          thumbnail: offer.thumbnail,
        }),
    ),
  })

export default mapCategoryJson
