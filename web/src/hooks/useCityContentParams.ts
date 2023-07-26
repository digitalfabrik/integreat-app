import { useParams } from 'react-router-dom'

const useCityContentParams = (): { cityCode: string; languageCode: string } => {
  const params = useParams()
  return { cityCode: params.cityCode!, languageCode: params.languageCode! }
}

export default useCityContentParams
