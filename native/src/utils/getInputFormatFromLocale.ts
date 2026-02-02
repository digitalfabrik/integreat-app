const getInputFormatFromLocale = (locale?: string): string => {
  const formatter = new Intl.DateTimeFormat(locale, {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  })

  // eslint-disable-next-line no-magic-numbers
  const inputDate = formatter.format(new Date(2020, 10 - 1, 1))

  if (inputDate.includes('٢٠٢٠')) {
    return inputDate.replace('٢٠٢٠', 'YYYY').replace('١٠', 'MM').replace('٠١', 'DD')
  }

  return inputDate
    .replace('2020', locale === 'pt' || locale === 'fr' ? 'AAAA' : 'YYYY')
    .replace('10', 'MM')
    .replace('01', 'DD')
}

export default getInputFormatFromLocale
