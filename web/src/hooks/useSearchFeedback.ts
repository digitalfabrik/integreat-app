import { useEffect, useState } from 'react'

import { FEEDBACK_QUERY_KEY, RATING_NEGATIVE, RATING_POSITIVE, SEARCH_ROUTE, SEARCH_QUERY_KEY, Rating } from 'shared'

import useRegionContentParams from './useRegionContentParams'

type UseSearchFeedbackReturn = {
  rating: Rating | null
  setRating: (rating: Rating | null) => void
  searchTerm: string | undefined
  setSearchTerm: (term: string) => void
  query: string | undefined
}

const useSearchFeedback = (queryParams: URLSearchParams): UseSearchFeedbackReturn => {
  const { route } = useRegionContentParams()

  const feedbackValue = queryParams.get(FEEDBACK_QUERY_KEY)
  const initialRating = feedbackValue === RATING_POSITIVE || feedbackValue === RATING_NEGATIVE ? feedbackValue : null
  const [rating, setRating] = useState<Rating | null>(initialRating)

  const query = route === SEARCH_ROUTE ? (queryParams.get(SEARCH_QUERY_KEY) ?? undefined) : undefined
  const [searchTerm, setSearchTerm] = useState<string | undefined>(query)

  useEffect(() => {
    setRating(initialRating)
  }, [initialRating])

  useEffect(() => {
    setSearchTerm(query)
  }, [query])

  return { rating, setRating, searchTerm, setSearchTerm, query }
}

export default useSearchFeedback
