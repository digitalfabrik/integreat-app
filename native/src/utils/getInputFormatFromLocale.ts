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

  const getYearPlaceholder = () => {
    if (locale === 'pt' || locale === 'fr') {
      return 'AAAA'
    }
    if (locale === 'de') {
      return 'JJJJ'
    }
    return 'YYYY'
  }

  const getDayPlaceholder = () => {
    if (locale === 'de') {
      return 'TT'
    }
    if (locale === 'fr') {
      return 'JJ'
    }
    return 'DD'
  }

  return inputDate.replace('2020', getYearPlaceholder()).replace('10', 'MM').replace('01', getDayPlaceholder())
}

export default getInputFormatFromLocale
