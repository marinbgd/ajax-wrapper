import ajax from './index'


describe('ajax', () => {

    beforeEach(() => {
        const mockFetchPromise = Promise.resolve({
            ok: true,
            status: 200,
            json: () => {}
        })
        global.fetch = jest.fn().mockImplementation(() => mockFetchPromise)
    })

    afterEach(() => {
        global.fetch.mockClear();
        delete global.fetch;
    })

    describe('get', () => {
        
        const testUrl = 'http://localhost/proba'

        it('should have get method', () => {
            expect(ajax.get).toBeDefined()
        })

        it('should make simple url get using fetch', () => {
            ajax.get({url: testUrl})

            expect(global.fetch.mock.calls.length).toBe(1)
            expect(global.fetch).toBeCalledWith(testUrl)
        })

        it('should call get method with url and params', () => {
            const testParams = {
                first: 'aa',
                second: 'bb',
            }
            const resultingUrl = testUrl + '?first=aa&second=bb'

            ajax.get({url: testUrl, params: testParams})

            expect(global.fetch.mock.calls.length).toBe(1)
            expect(global.fetch).toBeCalledWith(resultingUrl)
        })

        it('should call get method with url and encoded params', () => {
            const testParams = {
                first: ' aa',
            }
            const resultingUrl = testUrl + '?first=%20aa'

            ajax.get({url: testUrl, params: testParams})

            expect(global.fetch.mock.calls.length).toBe(1)
            expect(global.fetch).toBeCalledWith(resultingUrl)
        })

        it('should call get method with sorted params in query', () => {
            const testParams = {
                second: 'bb',
                first: 'aa',
            }
            const resultingUrl = testUrl + '?first=aa&second=bb'

            ajax.get({url: testUrl, params: testParams})

            expect(global.fetch.mock.calls.length).toBe(1)
            expect(global.fetch).toBeCalledWith(resultingUrl)
        })

        it('should call get method with headers', () => {
            const headers = {
                'Content-Type': 'text/plain',
                'X-Custom-Header': 'ProcessThisImmediately',
            }

            ajax.get({url: testUrl, headers })

            expect(global.fetch.mock.calls.length).toBe(1)
            expect(global.fetch).toBeCalledWith(testUrl, headers)
        })

        it('should throw an error when api response status is 400', () => {                
            const mockFetchPromise = Promise.resolve({
                ok: false,
                statusText: 'error',
            })
            global.fetch = jest.fn().mockImplementation(() => mockFetchPromise)
            
            expect(ajax.get({url: testUrl})).rejects.toThrow('error')
        })
    })
})