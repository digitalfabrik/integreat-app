import React, { ReactElement } from 'react'
import { RouteComponentProps } from 'react-router-dom'

type PropsType = RouteComponentProps<{ cityCode: string; languageCode: string, categoriesId: string | undefined }>

const CategoriesPage = ({ match }: PropsType): ReactElement => {
  console.log(match.params)
  return <div>CategoriesPage</div>
}

export default CategoriesPage
