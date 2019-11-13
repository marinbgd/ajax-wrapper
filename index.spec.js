import ajax from './index'


describe('ajax', () => {
    
    const testUrl = 'http://localhost/proba'

    beforeEach(() => {
        ajax.resetCache()

        const mockFetchPromise = Promise.resolve({
            ok: true,
            status: 200,
            json: () => ({
                data: 'test data'
            })
        })
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

    describe('get with isCached', () => {
        it('should call window fetch only once for 2 same request urls', () => {
            ajax.get({url: testUrl, isCached: true})
            ajax.get({url: testUrl, isCached: true})

            expect(global.fetch.mock.calls.length).toBe(1)
        })

        it('should get the same promise for same request url', () => {
            const promise1 = ajax.get({url: testUrl, isCached: true})
            const promise2 = ajax.get({url: testUrl, isCached: true})

            expect(promise1).toBe(promise2)
        })

        it('should get the same promise for same request url handling different param order', () => {
            const testParams1 = {
                first: 'aa',
                second: 'bb',
            }
            const testParams2 = {
                second: 'bb',
                first: 'aa',
            }
            const promise1 = ajax.get({url: testUrl, isCached: true, params: testParams1})
            const promise2 = ajax.get({url: testUrl, isCached: true, params: testParams2})

            expect(promise1).toBe(promise2)
        })

        it('should return exactly the same response (same object) if same URL and cache is not expired', async () => {
            expect.assertions(2)
            const cacheExpireInMs = 100000
            const result1 = await ajax.get({url: testUrl, isCached: true, cacheExpireInMs})
            const result2 = await ajax.get({url: testUrl, isCached: true, cacheExpireInMs})

            expect(result1).toBe(result2)
            expect(global.fetch.mock.calls.length).toBe(1)
        })

        xit('should make a new API request using window.fetch after defined cache expiry time', async () => {
            // fake timers do not work? should fix the test
            expect.assertions(2)
            jest.useFakeTimers()
            const cacheExpireInMs = 1000
            await ajax.get({url: testUrl, isCached: true, cacheExpireInMs})
            jest.advanceTimersByTime(2000);
            jest.runAllTimers();
            await ajax.get({url: testUrl, isCached: true, cacheExpireInMs})

            expect(global.fetch.mock.calls.length).toBe(2)

        })
    })    

})