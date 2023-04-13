import CategoriesMapModel from '../models/CategoriesMapModel'
import CategoryModel from '../models/CategoryModel'
import parseHTML from './parseHTML'
import { normalizeString } from './search'

export type CategorySearchResult = {
  category: CategoryModel
  contentWithoutHtml: string
}

const searchCategories = (categoriesMapModel: CategoriesMapModel, query: string): CategorySearchResult[] => {
  const normalizedQuery = normalizeString(query)
  const categories = categoriesMapModel.toArray().filter(it => !it.isRoot())

  // Lexicographically sorted categories with match in title
  const categoriesWithTitle = categories
    .filter(it => normalizeString(it.title).includes(normalizedQuery))
    .map(it => ({ category: it, contentWithoutHtml: parseHTML(it.content) }))
    .sort((result1, result2) => result1.category.title.localeCompare(result2.category.title))

  // Lexicographically sorted categories with match in content but not in title
  const categoriesWithContent = categories
    .filter(it => !normalizeString(it.title).includes(normalizedQuery))
    .map(it => ({ category: it, contentWithoutHtml: parseHTML(it.content) }))
    .filter(it => normalizeString(it.contentWithoutHtml).includes(normalizedQuery))
    .sort((result1, result2) => result1.category.title.localeCompare(result2.category.title))

  return categoriesWithTitle.concat(categoriesWithContent)
}

export default searchCategories
