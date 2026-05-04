import React, { ReactElement } from 'react'

import { DocumentModel } from 'shared/api'

import Page from '../components/Page'

type ImprintProps = {
  imprint: DocumentModel
  language: string
}

const Imprint = ({ imprint, language }: ImprintProps): ReactElement => {
  const { title, content, lastUpdate } = imprint
  return <Page title={title} content={content} language={language} lastUpdate={lastUpdate} />
}

export default Imprint
