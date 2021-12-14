import React, { ReactElement, useEffect } from 'react'

import { TunewsModel } from 'api-client'

type PropsType = {
  items: Array<TunewsModel>
  fetchMoreTunews: (page: number, count: number) => void
}
const TuNewsList = ({ items, fetchMoreTunews }: PropsType): ReactElement => {
  useEffect(() => {
    fetchMoreTunews(0, 2)
  }, [fetchMoreTunews])
  return (
    <div>
      {items.map(({ title, content }) => (
        <div key={title}>
          {title} {content}
        </div>
      ))}
    </div>
  )
}

export default TuNewsList
