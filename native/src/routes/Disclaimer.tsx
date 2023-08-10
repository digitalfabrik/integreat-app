import React, { ReactElement } from 'react'

import { PageModel } from 'api-client'

import Page from '../components/Page'

type DisclaimerProps = {
  disclaimer: PageModel
  language: string
}

const Disclaimer = ({ disclaimer, language }: DisclaimerProps): ReactElement => {
  const { title, content, lastUpdate, path } = disclaimer
  return <Page title={title} content={content} language={language} lastUpdate={lastUpdate} path={path} />
}

export default Disclaimer
