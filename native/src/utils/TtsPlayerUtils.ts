import { decode } from 'entities'
import segment from 'sentencex'

const removeHtmlTags = (html: string): string => html.replace(/<\/?[^>]+(>|$)/g, ' ').trim()

export const extractSentencesFromHtml = (html: string, language: string): string[] => {
  const decodedText = decode(html)
  const removedTags = removeHtmlTags(decodedText)
  return segment(language, removedTags)
}
