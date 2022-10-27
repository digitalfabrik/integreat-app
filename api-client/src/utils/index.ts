export const getSlugFromPath = (path: string): string => {
  const slug = path.split('/').pop()
  if (!slug) {
    throw new Error('Empty string is not a valid path')
  }
  return slug
}
