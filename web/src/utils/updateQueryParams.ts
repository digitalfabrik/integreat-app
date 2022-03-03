// This function adds or removes queryParams, depending if queryParams were passed else set pathname to remove
const updateQueryParams = (queryParams?: URLSearchParams): void => {
  const updatedUrl = queryParams ? `?${queryParams.toString()}` : window.location.pathname
  window.history.pushState(null, '', updatedUrl)
}
export default updateQueryParams
