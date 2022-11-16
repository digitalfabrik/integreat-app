export const getSlug = (path: string): string | undefined => path.split('/').pop() ?? undefined
