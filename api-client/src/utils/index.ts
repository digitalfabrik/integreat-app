import { Moment } from 'moment'

export const getSlugFromPath = (path: string): string => path.split('/').pop()!

export const formatDateICal = (date: Moment): string => `${date.format('YYYYMMDDTHHmm')}00Z`
