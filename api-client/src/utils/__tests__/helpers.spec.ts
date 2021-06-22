import { htmlDecode } from "../helpers";

describe.skip('Helper Methods', () => {
    describe('htmlDecode', () => {
        it('should decode HTML entyty', () => {
            expect(htmlDecode('&quot;mehrsprachige Laufbahnberatung&quot;')).toBe('')
        });
    });
});