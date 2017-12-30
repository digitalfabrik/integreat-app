import DisclaimerModel from '../DisclaimerModel'

describe('DisclaimerModel', () => {
  test('should return correct attributes', () => {
    const props = {
      id: 1689,
      title: 'Feedback, Kontakt und mögliches Engagement',
      content: 'test content blablabla'
    }
    const disclaimer = new DisclaimerModel(props)
    expect(disclaimer.id).toBe(props.id)
    expect(disclaimer.title).toBe(props.title)
    expect(disclaimer.content).toBe(props.content)
  })
})
