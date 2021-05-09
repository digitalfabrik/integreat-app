import config from '../config'
describe('config', () => {
  it('should decide correctly whether a language is supported', () => {
    expect(config.isSupportedLanguage('en')).toBeTruthy()
    expect(config.isSupportedLanguage('de')).toBeTruthy()
    expect(config.isSupportedLanguage('ps')).toBeTruthy()
    expect(config.isSupportedLanguage('kmr')).toBeTruthy()
    expect(config.isSupportedLanguage('ckb')).toBeTruthy()
    expect(config.isSupportedLanguage('de-si')).toBeTruthy()
  })
  it('should decide correctly whether a language is RTL', () => {
    expect(config.hasRTLScript('en')).toBeFalsy()
    expect(config.hasRTLScript('de')).toBeFalsy()
    expect(config.hasRTLScript('ps')).toBeTruthy()
    expect(config.hasRTLScript('kmr')).toBeFalsy()
    expect(config.hasRTLScript('ckb')).toBeTruthy()
    expect(config.hasRTLScript('de-si')).toBeFalsy()
  })
  it('should throw when requesting an unknown language', () => {
    expect(() => config.hasRTLScript('yi')).toThrow()
  })
  it('should have additional font if needed', () => {
    expect(config.getAdditionalFont('de')).toBeFalsy()
    expect(config.getAdditionalFont('ar')).toBeTruthy()
    expect(config.getAdditionalFont('fa')).toBeTruthy()
    expect(config.getAdditionalFont('kmr')).toBeFalsy()
    expect(config.getAdditionalFont('ckb')).toBeTruthy()
  })
})