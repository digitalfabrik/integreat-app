const decodeHtmlEntities = (html: string): string =>
  html
    // Handle decimal entities like &#1610;
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
    // Handle hexadecimal entities like &#x1F600;
    .replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)))
    // Handle named entities like &quot;, &amp;
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&apos;/g, "'") // Apostrophe

export const extractSentencesFromHtml = (html: string): string[] => {
  const decodedText = decodeHtmlEntities(html)
  const cleanText = decodedText.replace(/<\/?[^>]+(>|$)/g, '')
  const sentences = cleanText.split('.').map(sentence => sentence.trim())
  return sentences.filter(sentence => sentence.length > 0)
}
