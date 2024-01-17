import { JsonOfferPostType } from '../types'

const createPostMap = (jsonPost: JsonOfferPostType): Map<string, string> => new Map(Object.entries(jsonPost))

export default createPostMap
