import React, { ReactElement } from 'react'

import { PageModel } from 'shared/api'

import Page from '../components/Page'

type ImprintProps = {
  imprint: PageModel
  language: string
}

const Imprint = ({ imprint, language }: ImprintProps): ReactElement => {
  const { title, content, lastUpdate } = imprint
  return <Page title={title} content={content} language={language} lastUpdate={lastUpdate} />
}

export default Imprint
