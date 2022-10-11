import CategoriesMapModel from '../models/CategoriesMapModel'
import CategoryModel from '../models/CategoryModel'
import parseHTML from './parseHTML'
import { normalizeSearchString } from './search'

type Result = {
  category: CategoryModel
  contentWithoutHtml: string
}

const searchCategories = (categoriesMapModel: CategoriesMapModel, query: string): Result[] => {
  const normalizedQuery = normalizeSearchString(query)
  const categories = categoriesMapModel.toArray().filter(it => !it.isRoot())

  // Lexicographically sorted categories with match in title
  const categoriesWithTitle = categories
    .filter(it => normalizeSearchString(it.title).includes(normalizedQuery))
    .map(it => ({ category: it, contentWithoutHtml: parseHTML(it.content) }))
    .sort((result1, result2) => result1.category.title.localeCompare(result2.category.title))

  // Lexicographically sorted categories with match in content but not in title
  const categoriesWithContent = categories
    .filter(it => !normalizeSearchString(it.title).includes(normalizedQuery))
    .map(it => ({ category: it, contentWithoutHtml: parseHTML(it.content) }))
    .filter(it => normalizeSearchString(it.contentWithoutHtml).includes(normalizedQuery))
    .sort((result1, result2) => result1.category.title.localeCompare(result2.category.title))

  return categoriesWithTitle.concat(categoriesWithContent)
}

export default searchCategories
