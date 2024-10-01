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
  // Remove HTML tags
  const cleanText = decodedText.replace(/<\/?[^>]+(>|$)/g, '')

  // Split by periods but avoid splitting abbreviations
  let sentences = cleanText
    .split(/(?<!\b(?:e\.g|i\.e|etc|ex))\.\s+/i) // negative lookbehind for abbreviations
    .map(sentence => sentence.trim())

  // Further split based on newlines, if it's a list
  sentences = sentences.flatMap(sentence => sentence.split(/\n+/).map(line => line.trim()))

  // Filter out empty sentences
  return sentences.filter(sentence => sentence.length > 0)
}
