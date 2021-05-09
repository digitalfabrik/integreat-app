import ContentMatcher from "../ContentMatcher";
describe('ContentMatcher', () => {
  const numWords = 3;
  describe('getWords', () => {
    it('should return empty list for an empty input', () => {
      const testString = '';
      const matcher = new ContentMatcher();
      expect(matcher.getWords(testString)).toEqual([]);
    });
    it('should split text into words and remove all whitespace characters', () => {
      const testString = ' a \tb \r\nc\n\nd-e ,f :g /h';
      const matcher = new ContentMatcher();
      expect(matcher.getWords(testString)).toEqual(['a', 'b', 'c', 'd-e', ',f', ':g', '/h']);
    });
  });
  describe('getContentBeforeMatchIndex', () => {
    it('should return 3 words before the specified index an start of the word', () => {
      const content = 'This is some test content';
      const matchIndex = 15;
      const matcher = new ContentMatcher();
      expect(matcher.getContentBeforeMatchIndex(content, matchIndex, false, numWords)).toBe('This is some te');
    });
    it('should return 3 words before the specified index', () => {
      const content = 'This is some test content';
      const matchIndex = 13;
      const matcher = new ContentMatcher();
      expect(matcher.getContentBeforeMatchIndex(content, matchIndex, true, numWords)).toBe('This is some ');
    });
  });
  describe('getMatchedContentAfterMatchIndex', () => {
    it('should return 3 words before the specified index an start of the word', () => {
      const content = 'This is some test content';
      const matchIndex = 1;
      const matcher = new ContentMatcher();
      expect(matcher.getContentAfterMatchIndex(content, matchIndex, numWords)).toBe('his is some test');
    });
    it('should return 3 words before the specified index', () => {
      const content = 'This is some test content';
      const matchIndex = 0;
      const matcher = new ContentMatcher();
      expect(matcher.getContentAfterMatchIndex(content, matchIndex, numWords)).toBe('This is some test');
    });
  });
  it('should return null for undefined query', () => {
    const content = 'This is some test content';
    const query = undefined;
    const matcher = new ContentMatcher();
    expect(matcher.getMatchedContent(query, content, numWords)).toBeNull();
  });
  it('should return null for missing content', () => {
    const content = '';
    const query = undefined;
    const matcher = new ContentMatcher();
    expect(matcher.getMatchedContent(query, content, numWords)).toBeNull();
  });
  it('should return null for empty query', () => {
    const content = 'This is some test content';
    const query = '';
    const matcher = new ContentMatcher();
    expect(matcher.getMatchedContent(query, content, numWords)).toBeNull();
  });
  it('should return the match with query starting at the beginning of a word', () => {
    const query = 'test';
    const content = 'this is a test content which is longer than usual';
    const selectedSection = 'this is a test content which is';
    const matcher = new ContentMatcher();
    expect(matcher.getMatchedContent(query, content, numWords)).toEqual(selectedSection);
  });
  it('should not return a match', () => {
    const query = 'not in the text';
    const content = 'this is a test content which is longer than usual';
    const matcher = new ContentMatcher();
    expect(matcher.getMatchedContent(query, content, numWords)).toBeNull();
  });
  it('should match the same for query matching whole word and query matching in between a word', () => {
    const content = 'this is a test content which is longer than usual';
    const completeWordQuery = 'test';
    const inBetweenWordQuery = 'es';
    const matcher = new ContentMatcher();
    const contentMatch = matcher.getMatchedContent(completeWordQuery, content, numWords);
    const contentMatchDifferentQuery = matcher.getMatchedContent(inBetweenWordQuery, content, numWords);
    expect(contentMatch).toEqual(contentMatchDifferentQuery);
  });
});