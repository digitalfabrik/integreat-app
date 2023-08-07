import { useParams } from 'react-router-dom'

const useCityContentParams = (): { cityCode: string; languageCode: string } => {
  const params = useParams()
  return { cityCode: params.cityCode as string, languageCode: params.languageCode as string }
}

export default useCityContentParams
