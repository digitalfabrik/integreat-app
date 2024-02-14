import { CategoriesMapModel, EventModel, PoiModel } from '../api'
import { SearchResult } from '../hooks/useMiniSearch'

const formatSearchResults = (
  categories?: CategoriesMapModel | null,
  events?: EventModel[] | null,
  locations?: PoiModel[] | null,
): SearchResult[] => [
  ...(categories
    ?.toArray()
    .filter(category => !category.isRoot())
    .map(category => ({
      title: category.title,
      content: category.content,
      path: category.path,
      id: category.path,
      thumbnail: category.thumbnail,
    })) ?? []),
  ...(events?.map(event => ({
    title: event.title,
    content: event.content,
    path: event.path,
    id: event.path,
    thumbnail: event.thumbnail,
  })) ?? []),
  ...(locations?.map(location => ({
    title: location.title,
    content: location.content,
    path: location.path,
    id: location.slug,
    thumbnail: location.thumbnail,
  })) ?? []),
]

export default formatSearchResults
