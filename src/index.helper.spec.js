import {
    isEmptyObject,
    _addHeadersToOptions,
} from './index.helper'


describe('helper', () => {
    describe('isEmptyObject', () => {
        it('should return true for empty object literal {}', () => {
            const object = {}
            expect(isEmptyObject(object)).toBe(true)
        })

        it('should return true for empty new Object()', () => {
            const object = new Object()
            expect(isEmptyObject(object)).toBe(true)
        })

        it('should return false for object with one prop', () => {
            const object = {
                prop: 'a'
            }
            expect(isEmptyObject(object)).toBe(false)
        })

        it('should return false for new Object() with one prop', () => {
            const object = new Object({
                prop: 'a'
            })
            expect(isEmptyObject(object)).toBe(false)
        })

        it('should return true for empty object created with Object.create()', () => {
            const object = Object.create( Object.prototype, {} )
            expect(isEmptyObject(object)).toBe(true)
        })

        it('should return true for object created with Object.create() with enumarable false', () => {
            const object = Object.create(Object.prototype, {
                  name: {
                    value: 'Fiesta',
                    configurable: true,
                    writable: true,
                    enumerable: false,
                  },
                }
            )
            expect(isEmptyObject(object)).toBe(true)
        })

        it('should return false for object created with Object.create() with enumarable true', () => {
            const object = Object.create(Object.prototype, {
                  name: {
                    value: 'Fiesta',
                    configurable: true,
                    writable: true,
                    enumerable: true,
                  },
                }
            )
            expect(isEmptyObject(object)).toBe(false)
        })

    })

    describe('addHeadersToOptions', () => {

        it('should add headers to null options', () => {
            const headers = {
                'custom header': 'custom header value',
                'custom header2': 'custom header value 2',
            }

            const newOptions = _addHeadersToOptions(null, headers)
            const expectedOptions = {
                headers: {
                    ...headers,
                }
            }
            expect(newOptions).toStrictEqual(expectedOptions)
        })

        it('should add headers to undefined options', () => {
            const headers = {
                'custom header': 'custom header value',
                'custom header2': 'custom header value 2',
            }

            const newOptions = _addHeadersToOptions(undefined, headers)
            const expectedOptions = {
                headers: {
                    ...headers,
                }
            }
            expect(newOptions).toStrictEqual(expectedOptions)
        })

        it('should add headers to empty object options', () => {
            const headers = {
                'custom header': 'custom header value',
                'custom header2': 'custom header value 2',
            }

            const newOptions = _addHeadersToOptions({}, headers)
            const expectedOptions = {
                headers: {
                    ...headers,
                }
            }
            expect(newOptions).toStrictEqual(expectedOptions)
        })

        it('should add headers to options with data props', () => {
            const headers = {
                'custom header': 'custom header value',
                'custom header2': 'custom header value 2',
            }
            const data = {
                body: 'body value',
            }

            const newOptions = _addHeadersToOptions({ data }, headers)
            const expectedOptions = {
                headers: {
                    ...headers,
                },
                data: {
                    ...data,
                },
            }
            expect(newOptions).toStrictEqual(expectedOptions)
        })

        it('should merge headers to options with headers already defined', () => {
            const oldHeaders = {
                'old header': 'old header value',
            }
            const newHeaders = {
                'custom header': 'custom header value',
                'custom header2': 'custom header value 2',
            }

            const expectedOptions = {
                headers: {
                    ...oldHeaders,
                    ...newHeaders,
                },
            }

            const newOptions = _addHeadersToOptions(
                { 
                    headers: {
                        ...oldHeaders
                    }
                }, newHeaders)

            expect(newOptions).toStrictEqual(expectedOptions)
        })

        it('should merge and overwrite with new headers options with headers already defined', () => {
            const oldHeaders = {
                'old header': 'old header value',
            }
            const newHeaders = {
                'custom header': 'custom header value',
                'custom header2': 'custom header value 2',
                'old header': 'old header new value',
            }

            const expectedOptions = {
                headers: {
                    ...newHeaders,
                },
            }

            const newOptions = _addHeadersToOptions(
                { 
                    headers: {
                        ...oldHeaders
                    }
                }, newHeaders)
                
            expect(newOptions).toStrictEqual(expectedOptions)
        })
    })
})