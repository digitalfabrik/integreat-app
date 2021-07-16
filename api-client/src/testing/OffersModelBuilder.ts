import OfferModel from '../models/OfferModel'

const offers = [
  new OfferModel({
    alias: 'sprungbrett',
    title: 'Sprungbrett',
    path: 'https://my.sprung.br/ett/api',
    thumbnail: '',
  }),
  new OfferModel({
    alias: 'jobboerse',
    title: 'Jobboerse',
    path: 'https://my.jobs.com/api',
    thumbnail: '',
  }),
  new OfferModel({
    alias: 'some_extra',
    title: 'Some Extra',
    path: 'https://my.ran.om/api',
    thumbnail: '',
  })
]

class OfferModelBuilder {
  _offersCount: number

  constructor(offersCount: number) {
    this._offersCount = offersCount

    if (this._offersCount > offers.length) {
      throw new Error(`Only ${offers.length} offers models can be created`)
    }
  }

  build(): Array<OfferModel> {
    return offers.slice(0, this._offersCount)
  }
}

export default OfferModelBuilder
