import { createAction } from 'redux-actions'
import { CATEGORIES_ROUTE } from './categories'

export const goToCategories = (city: string, language: string, categoryPath: ?string) =>
  createAction(CATEGORIES_ROUTE)({city, language, categoryPath})
