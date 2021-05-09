const textTruncator = (text: string, numOfWordsAllowed: number): string => {
  const ellipsis = '...';
  const words = text.replace('\n', '').split(' ');

  if (words.length < numOfWordsAllowed) {
    return text;
  }

  const truncatedText = words.splice(0, numOfWordsAllowed).join(' ');
  return truncatedText + ellipsis;
};

export default textTruncator;