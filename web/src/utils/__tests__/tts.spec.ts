import { getTtsVoice } from '../tts'

jest.mock('easy-speech')

describe('getTtsVoice', () => {
  it('should return correct voices', () => {
    expect(getTtsVoice('en')?.name).toBe('Daniel')
    expect(getTtsVoice('de')?.name).toBe('Anna')
    expect(getTtsVoice('de-si')?.name).toBe('Anna')
    expect(getTtsVoice('fr')?.name).toBe('Claude')
  })
})
