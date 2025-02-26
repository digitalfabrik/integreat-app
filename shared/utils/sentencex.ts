import segment from 'sentencex'

const segmentation = (languageCode: string, content: string): string[] => segment(languageCode, content)

export default segmentation
