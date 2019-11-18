import fetch from './index'


describe('fetcher', () => {
    
    const testUrl = 'http://localhost/proba'

    describe('gets', () => {
        beforeEach(() => {
            fetch.resetCache()
    
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
                expect(fetch.get).toBeDefined()
            })
    
            it('should make simple url get using fetch', () => {
                fetch.get({url: testUrl})
    
                expect(global.fetch.mock.calls.length).toBe(1)
                expect(global.fetch).toBeCalledWith(testUrl)
            })
    
            it('should call get method with url and params', () => {
                const testParams = {
                    first: 'aa',
                    second: 'bb',
                }
                const resultingUrl = testUrl + '?first=aa&second=bb'
    
                fetch.get({url: testUrl, params: testParams})
    
                expect(global.fetch.mock.calls.length).toBe(1)
                expect(global.fetch).toBeCalledWith(resultingUrl)
            })
    
            it('should call get method with url and encoded params', () => {
                const testParams = {
                    first: ' aa',
                }
                const resultingUrl = testUrl + '?first=%20aa'
    
                fetch.get({url: testUrl, params: testParams})
    
                expect(global.fetch.mock.calls.length).toBe(1)
                expect(global.fetch).toBeCalledWith(resultingUrl)
            })
    
            it('should call get method with sorted params in query', () => {
                const testParams = {
                    second: 'bb',
                    first: 'aa',
                }
                const resultingUrl = testUrl + '?first=aa&second=bb'
    
                fetch.get({url: testUrl, params: testParams})
    
                expect(global.fetch.mock.calls.length).toBe(1)
                expect(global.fetch).toBeCalledWith(resultingUrl)
            })
    
            it('should call get method with headers', () => {
                const headers = {
                    'Content-Type': 'text/plain',
                    'X-Custom-Header': 'ProcessThisImmediately',
                }
    
                fetch.get({url: testUrl, headers })
    
                expect(global.fetch.mock.calls.length).toBe(1)
                expect(global.fetch).toBeCalledWith(testUrl, { headers })
            })
    
            it('should throw an error on get request when api response status is 400', () => {                
                const mockFetchPromise = Promise.resolve({
                    ok: false,
                    statusText: 'error',
                })
                global.fetch = jest.fn().mockImplementation(() => mockFetchPromise)
                
                expect(fetch.get({url: testUrl})).rejects.toThrow('error')
            })
        })
    
        describe('get with isCached', () => {
            it('should call window fetch only once for 2 same request urls', () => {
                fetch.get({url: testUrl, isCached: true})
                fetch.get({url: testUrl, isCached: true})
    
                expect(global.fetch.mock.calls.length).toBe(1)
            })
    
            it('should get the same promise for same request url', () => {
                const promise1 = fetch.get({url: testUrl, isCached: true})
                const promise2 = fetch.get({url: testUrl, isCached: true})
    
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
                const promise1 = fetch.get({url: testUrl, isCached: true, params: testParams1})
                const promise2 = fetch.get({url: testUrl, isCached: true, params: testParams2})
    
                expect(promise1).toBe(promise2)
            })
    
            it('should return exactly the same response (same object) if same URL and cache is not expired', async () => {
                expect.assertions(2)
                const cacheExpireInMs = 100000
                const result1 = await fetch.get({url: testUrl, isCached: true, cacheExpireInMs})
                const result2 = await fetch.get({url: testUrl, isCached: true, cacheExpireInMs})
    
                expect(result1).toBe(result2)
                expect(global.fetch.mock.calls.length).toBe(1)
            })
    
            xit('should make a new API request using window.fetch after defined cache expiry time', async () => {
                // fake timers do not work? should fix the test
                expect.assertions(2)
                jest.useFakeTimers()
                const cacheExpireInMs = 1000
                await fetch.get({url: testUrl, isCached: true, cacheExpireInMs})
                jest.advanceTimersByTime(2000);
                jest.runAllTimers();
                await fetch.get({url: testUrl, isCached: true, cacheExpireInMs})
    
                expect(global.fetch.mock.calls.length).toBe(2)
    
            })
        })
    })

    

    describe('post', () => {

        beforeEach(() => {    
            const mockFetchPromise = Promise.resolve({
                ok: true,
                status: 200,
                json: () => ({
                    data: 'post data'
                })
            })
            global.fetch = jest.fn().mockImplementation(() => mockFetchPromise)
        })
    
        afterEach(() => {
            global.fetch.mockClear();
            delete global.fetch;
        })

        it('should have post method', () => {
            expect(fetch.post).toBeDefined()
        })

        it('should make simple post request with url and data using fetch', () => {
            const data = { id: 1 }
            fetch.post({url: testUrl, data})

            const expectedFetchOptions = {
                method: 'post',
                body: JSON.stringify(data),
            }
            expect(global.fetch.mock.calls.length).toBe(1)
            expect(global.fetch).toBeCalledWith(testUrl, expectedFetchOptions)
        })

        it('should call post method with url, data and params', () => {
            const data = { id: 1 }
            const testParams = {
                first: 'aa',
                second: 'bb',
            }
            const resultingUrl = testUrl + '?first=aa&second=bb'
            const expectedFetchOptions = {
                method: 'post',
                body: JSON.stringify(data),
            }

            fetch.post({url: testUrl, params: testParams, data})

            expect(global.fetch.mock.calls.length).toBe(1)
            expect(global.fetch).toBeCalledWith(resultingUrl, expectedFetchOptions)
        })

        it('should call post method with url, data and encoded params in query', () => {
            const data = { id: 1 }
            const testParams = {
                first: ' aa',
            }
            const resultingUrl = testUrl + '?first=%20aa'
            const expectedFetchOptions = {
                method: 'post',
                body: JSON.stringify(data),
            }

            fetch.post({url: testUrl, params: testParams, data})

            expect(global.fetch.mock.calls.length).toBe(1)
            expect(global.fetch).toBeCalledWith(resultingUrl, expectedFetchOptions)
        })

        it('should call post method with url, data and sorted params in query', () => {
            const data = { id: 1 }
            const testParams = {
                second: 'bb',
                first: 'aa',
            }
            const resultingUrl = testUrl + '?first=aa&second=bb'
            const expectedFetchOptions = {
                method: 'post',
                body: JSON.stringify(data),
            }

            fetch.post({url: testUrl, params: testParams, data})

            expect(global.fetch.mock.calls.length).toBe(1)
            expect(global.fetch).toBeCalledWith(resultingUrl, expectedFetchOptions)
        })

        it('should call post method with url, data and custom headers', () => {
            const data = { id: 1 }
            const headers = {
                'Content-Type': 'text/plain',
                'X-Custom-Header': 'ProcessThisImmediately',
            }
            const expectedFetchOptions = {
                method: 'post',
                headers,
                body: JSON.stringify(data),
            }

            fetch.post({url: testUrl, headers, data })

            expect(global.fetch.mock.calls.length).toBe(1)
            expect(global.fetch).toBeCalledWith(testUrl, expectedFetchOptions)
        })

        it('should throw an error on post request when api response status is 400', () => {                
            const mockFetchPromise = Promise.resolve({
                ok: false,
                statusText: 'error',
            })
            global.fetch = jest.fn().mockImplementation(() => mockFetchPromise)
            
            expect(fetch.post({url: testUrl})).rejects.toThrow('error')
        })

    })


    describe('put', () => {

        beforeEach(() => {    
            const mockFetchPromise = Promise.resolve({
                ok: true,
                status: 200,
                json: () => ({
                    data: 'put data'
                })
            })
            global.fetch = jest.fn().mockImplementation(() => mockFetchPromise)
        })
    
        afterEach(() => {
            global.fetch.mockClear();
            delete global.fetch;
        })

        it('should have put method', () => {
            expect(fetch.put).toBeDefined()
        })

        it('should make simple url put using fetch', () => {
            const data = { id: 1 }
            fetch.put({url: testUrl, data})

            const expectedFetchOptions = {
                method: 'put',
                body: JSON.stringify(data),
            }
            expect(global.fetch.mock.calls.length).toBe(1)
            expect(global.fetch).toBeCalledWith(testUrl, expectedFetchOptions)
        })

        it('should call put method with url, data and params', () => {
            const data = { id: 1 }
            const testParams = {
                first: 'aa',
                second: 'bb',
            }
            const resultingUrl = testUrl + '?first=aa&second=bb'
            const expectedFetchOptions = {
                method: 'put',
                body: JSON.stringify(data),
            }

            fetch.put({url: testUrl, params: testParams, data})

            expect(global.fetch.mock.calls.length).toBe(1)
            expect(global.fetch).toBeCalledWith(resultingUrl, expectedFetchOptions)
        })

        it('should call put method with url, data and encoded params in query', () => {
            const data = { id: 1 }
            const testParams = {
                first: ' aa',
            }
            const resultingUrl = testUrl + '?first=%20aa'
            const expectedFetchOptions = {
                method: 'put',
                body: JSON.stringify(data),
            }

            fetch.put({url: testUrl, params: testParams, data})

            expect(global.fetch.mock.calls.length).toBe(1)
            expect(global.fetch).toBeCalledWith(resultingUrl, expectedFetchOptions)
        })

        it('should call put method with url, data and sorted params in query', () => {
            const data = { id: 1 }
            const testParams = {
                second: 'bb',
                first: 'aa',
            }
            const resultingUrl = testUrl + '?first=aa&second=bb'
            const expectedFetchOptions = {
                method: 'put',
                body: JSON.stringify(data),
            }

            fetch.put({url: testUrl, params: testParams, data})

            expect(global.fetch.mock.calls.length).toBe(1)
            expect(global.fetch).toBeCalledWith(resultingUrl, expectedFetchOptions)
        })

        it('should call put method with url, data and custom headers', () => {
            const data = { id: 1 }
            const headers = {
                'Content-Type': 'text/plain',
                'X-Custom-Header': 'ProcessThisImmediately',
            }
            const expectedFetchOptions = {
                method: 'put',
                headers,
                body: JSON.stringify(data),
            }

            fetch.put({url: testUrl, headers, data })

            expect(global.fetch.mock.calls.length).toBe(1)
            expect(global.fetch).toBeCalledWith(testUrl, expectedFetchOptions)
        })

        it('should throw an error on put request when api response status is 400', () => {                
            const mockFetchPromise = Promise.resolve({
                ok: false,
                statusText: 'error',
            })
            global.fetch = jest.fn().mockImplementation(() => mockFetchPromise)
            
            expect(fetch.put({url: testUrl})).rejects.toThrow('error')
        })

    })
    

    describe('patch', () => {

        beforeEach(() => {    
            const mockFetchPromise = Promise.resolve({
                ok: true,
                status: 200,
                json: () => ({
                    data: 'patch data'
                })
            })
            global.fetch = jest.fn().mockImplementation(() => mockFetchPromise)
        })
    
        afterEach(() => {
            global.fetch.mockClear();
            delete global.fetch;
        })

        it('should have patch method', () => {
            expect(fetch.patch).toBeDefined()
        })

        it('should make simple patch request using fetch', () => {
            const data = { id: 1 }
            fetch.patch({url: testUrl, data})

            const expectedFetchOptions = {
                method: 'patch',
                body: JSON.stringify(data),
            }
            expect(global.fetch.mock.calls.length).toBe(1)
            expect(global.fetch).toBeCalledWith(testUrl, expectedFetchOptions)
        })

        it('should call patch method with url, data and params', () => {
            const data = { id: 1 }
            const testParams = {
                first: 'aa',
                second: 'bb',
            }
            const resultingUrl = testUrl + '?first=aa&second=bb'
            const expectedFetchOptions = {
                method: 'patch',
                body: JSON.stringify(data),
            }

            fetch.patch({url: testUrl, params: testParams, data})

            expect(global.fetch.mock.calls.length).toBe(1)
            expect(global.fetch).toBeCalledWith(resultingUrl, expectedFetchOptions)
        })

        it('should call patch method with url, data and encoded params in query', () => {
            const data = { id: 1 }
            const testParams = {
                first: ' aa',
            }
            const resultingUrl = testUrl + '?first=%20aa'
            const expectedFetchOptions = {
                method: 'patch',
                body: JSON.stringify(data),
            }

            fetch.patch({url: testUrl, params: testParams, data})

            expect(global.fetch.mock.calls.length).toBe(1)
            expect(global.fetch).toBeCalledWith(resultingUrl, expectedFetchOptions)
        })

        it('should call patch method with url, data and sorted params in query', () => {
            const data = { id: 1 }
            const testParams = {
                second: 'bb',
                first: 'aa',
            }
            const resultingUrl = testUrl + '?first=aa&second=bb'
            const expectedFetchOptions = {
                method: 'patch',
                body: JSON.stringify(data),
            }

            fetch.patch({url: testUrl, params: testParams, data})

            expect(global.fetch.mock.calls.length).toBe(1)
            expect(global.fetch).toBeCalledWith(resultingUrl, expectedFetchOptions)
        })

        it('should call patch method with url, data and custom headers', () => {
            const data = { id: 1 }
            const headers = {
                'Content-Type': 'text/plain',
                'X-Custom-Header': 'ProcessThisImmediately',
            }
            const expectedFetchOptions = {
                method: 'patch',
                headers,
                body: JSON.stringify(data),
            }

            fetch.patch({url: testUrl, headers, data })

            expect(global.fetch.mock.calls.length).toBe(1)
            expect(global.fetch).toBeCalledWith(testUrl, expectedFetchOptions)
        })

        it('should throw an error on patch request when api response status is 400', () => {                
            const mockFetchPromise = Promise.resolve({
                ok: false,
                statusText: 'error',
            })
            global.fetch = jest.fn().mockImplementation(() => mockFetchPromise)
            
            expect(fetch.patch({url: testUrl})).rejects.toThrow('error')
        })

    })


    describe('delete', () => {

        beforeEach(() => {    
            const mockFetchPromise = Promise.resolve({
                ok: true,
                status: 200,
                json: () => ({
                    data: 'delete data'
                })
            })
            global.fetch = jest.fn().mockImplementation(() => mockFetchPromise)
        })
    
        afterEach(() => {
            global.fetch.mockClear();
            delete global.fetch;
        })

        it('should have delete method', () => {
            expect(fetch.delete).toBeDefined()
        })

        it('should make simple delete request using fetch', () => {
            fetch.delete({url: testUrl})

            const expectedFetchOptions = {
                method: 'delete',
            }
            expect(global.fetch.mock.calls.length).toBe(1)
            expect(global.fetch).toBeCalledWith(testUrl, expectedFetchOptions)
        })

        it('should call delete method with url, data and params', () => {
            const data = { id: 1 }
            const testParams = {
                first: 'aa',
                second: 'bb',
            }
            const resultingUrl = testUrl + '?first=aa&second=bb'
            const expectedFetchOptions = {
                method: 'delete',
                body: JSON.stringify(data),
            }

            fetch.delete({url: testUrl, params: testParams, data})

            expect(global.fetch.mock.calls.length).toBe(1)
            expect(global.fetch).toBeCalledWith(resultingUrl, expectedFetchOptions)
        })

        it('should call delete method with url, data and encoded params in query', () => {
            const data = { id: 1 }
            const testParams = {
                first: ' aa',
            }
            const resultingUrl = testUrl + '?first=%20aa'
            const expectedFetchOptions = {
                method: 'delete',
                body: JSON.stringify(data),
            }

            fetch.delete({url: testUrl, params: testParams, data})

            expect(global.fetch.mock.calls.length).toBe(1)
            expect(global.fetch).toBeCalledWith(resultingUrl, expectedFetchOptions)
        })

        it('should call delete method with url, data and sorted params in query', () => {
            const data = { id: 1 }
            const testParams = {
                second: 'bb',
                first: 'aa',
            }
            const resultingUrl = testUrl + '?first=aa&second=bb'
            const expectedFetchOptions = {
                method: 'delete',
                body: JSON.stringify(data),
            }

            fetch.delete({url: testUrl, params: testParams, data})

            expect(global.fetch.mock.calls.length).toBe(1)
            expect(global.fetch).toBeCalledWith(resultingUrl, expectedFetchOptions)
        })

        it('should call delete method with url, data and custom headers', () => {
            const data = { id: 1 }
            const headers = {
                'Content-Type': 'text/plain',
                'X-Custom-Header': 'ProcessThisImmediately',
            }
            const expectedFetchOptions = {
                method: 'delete',
                headers,
                body: JSON.stringify(data),
            }

            fetch.delete({url: testUrl, headers, data })

            expect(global.fetch.mock.calls.length).toBe(1)
            expect(global.fetch).toBeCalledWith(testUrl, expectedFetchOptions)
        })

        it('should throw an error on delete request when api response status is 400', () => {                
            const mockFetchPromise = Promise.resolve({
                ok: false,
                statusText: 'error',
            })
            global.fetch = jest.fn().mockImplementation(() => mockFetchPromise)
            
            expect(fetch.delete({url: testUrl})).rejects.toThrow('error')
        })

    })

})