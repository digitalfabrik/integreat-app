import EventModel from '../models/EventModel'

export const getSlug = (path: string): string | undefined => path.split('/').pop() ?? undefined

export const getEventSlug = (event: EventModel): string | undefined => {
  const dollarIndexOffset = 11

  if (event.path[event.path.length - dollarIndexOffset] === '$') {
    // reoccuring events have the current event date attached to the slug
    const pathWithoutDate = event.path.slice(0, event.path.lastIndexOf('$'))
    const slug = getSlug(pathWithoutDate)
    return slug
  }
  return getSlug(event.path)
}
