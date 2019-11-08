import ajax from './index'


describe('ajax', () => {

    beforeEach(() => {
        const mockFetchPromise = Promise.resolve()
        global.fetch = jest.fn().mockImplementation(() => mockFetchPromise)
    })

    afterEach(() => {
        global.fetch.mockClear();
        delete global.fetch;
    })

    describe('get', () => {
        it('should have get method', () => {
            expect(ajax.get).toBeDefined()
        })

        it('should make simple url get using fetch', () => {
            const testUrl = 'http://localhost/proba'

            ajax.get({url: testUrl})

            expect(global.fetch.mock.calls.length).toBe(1)
            expect(global.fetch).toBeCalledWith(testUrl)
        })

        it('should call get method with url and params', () => {
            const testUrl = 'http://localhost/proba'
            const testParams = {
                first: 'aa',
                second: 'bb',
            }
            const resultingUrl = testUrl + '?first=aa&second=bb'

            ajax.get({url: testUrl, params: testParams})

            expect(global.fetch.mock.calls.length).toBe(1)
            expect(global.fetch).toBeCalledWith(resultingUrl)
        })

        it('should call get method with sorted params in query', () => {
            const testUrl = 'http://localhost/proba'
            const testParams = {
                second: 'bb',
                first: 'aa',
            }
            const resultingUrl = testUrl + '?first=aa&second=bb'

            ajax.get({url: testUrl, params: testParams})

            expect(global.fetch.mock.calls.length).toBe(1)
            expect(global.fetch).toBeCalledWith(resultingUrl)
        })
    })
})