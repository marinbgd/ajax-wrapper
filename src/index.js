const MINUTE_IN_MS = 60000
const DEFAULT_FETCH_CACHE_TIME = MINUTE_IN_MS; 

class Fetcher {
    constructor () {
        this.cache = {}
    }

    _getCachedResponse( urlWithParams ) {
        return Promise.resolve( this.cache[urlWithParams].response );
    }

    _isCachedResponseValid( { urlWithParams, cacheExpireInMs } ) {
        if ( ! ( this.cache[urlWithParams] && this.cache[urlWithParams].response ) ) { return false; }

        const cachedResponse = this.cache[urlWithParams];
        const cacheTimeMs = cachedResponse.timestamp.getTime();
        const timeNowInMs = new Date().getTime();
        const diffInMs = timeNowInMs - cacheTimeMs;
        return ( diffInMs < cacheExpireInMs );
    }

    _persistResponse( { urlWithParams, response, cacheExpireInMs } ) {
        this.cache[urlWithParams] = {
            ...this.cache[urlWithParams],
            response,
            cacheExpireInMs,
            timestamp: new Date(),
        }
    }

    _isAjaxRequestInProgress( urlWithParams ) {
        return !!(this.cache[urlWithParams] && this.cache[urlWithParams].ajaxPromise);
    }

    _getAjaxRequestInProgress( urlWithParams ) {
        return this.cache[urlWithParams].ajaxPromise;
    }

    _persistAjaxRequestPromise( { urlWithParams, ajaxPromise } ) {
        this.cache[urlWithParams] = {
            ...this.cache[urlWithParams],
            ajaxPromise,
        };
    }

    _clearAjaxRequestPromise( urlWithParams ) {
        if (!this.cache[urlWithParams]) {
            this.cache[urlWithParams] = {};
        }
        this.cache[urlWithParams].ajaxPromise = null;
    }
    
    _handleFetchErrors (fetchResponse) {
        if (!fetchResponse.ok) {
            throw Error(fetchResponse.statusText);
        }
        return fetchResponse;
    }
    
    _getFetchArgs (urlWithParams, options) {
        let fetchPromiseCallArgs = [urlWithParams]
        if (options) {
            fetchPromiseCallArgs = [urlWithParams, options]
        }
        return fetchPromiseCallArgs
    }
    
    _getEncodedParams (params) {
        if (!params) {
            return params
        }
    
        let encodedParams = {}
        Object.keys(params).forEach( key => {
            const encodedKey = window.encodeURIComponent(key)
            const encodedParam = window.encodeURIComponent(params[key])
            encodedParams[encodedKey] = encodedParam
        })
        return encodedParams
    }

    _addParamsToUrl (url, params) {
        if (!params) {
            return url
        }
    
        const encodedParams = this._getEncodedParams(params)
        const keys = Object.keys(encodedParams)
        const orderedKeys = keys.sort()
        let urlWithQuery = url
        orderedKeys.forEach((key, index) => {
            if (index === 0) {
                urlWithQuery += `?${key}=${encodedParams[key]}`
            } else {
                urlWithQuery += `&${key}=${encodedParams[key]}`
            }
        })
    
        return urlWithQuery
    }
    
    _addHeadersToOptions (options = {}, headers = null) {
        if (!headers) {
            return options
        }
    
        return {
            ...options,
            headers,
        }
    }

    _addBodyToOptions (options = {}, data = null) {
        if (!data) {
            return options
        }

        return {
            ...options,
            body: JSON.stringify(data),
        }
    }
    

    resetCache () {
        this.cache = {}
    }


    get ({
        url,
        params = null, 
        headers = null, 
        isCached = false,
        cacheExpireInMs = DEFAULT_FETCH_CACHE_TIME,
    }) {
        const urlWithParams = this._addParamsToUrl(url, params)
        const options = this._addHeadersToOptions(headers)
        const fetchPromiseCallArgs = this._getFetchArgs(urlWithParams, options)
        
        if ( isCached && this._isAjaxRequestInProgress( urlWithParams ) ) {
            return this._getAjaxRequestInProgress( urlWithParams );
        }

        if ( isCached && this._isCachedResponseValid( { urlWithParams, cacheExpireInMs } ) ) {
            return this._getCachedResponse( urlWithParams );
        }
    
        let fetchPromise = window.fetch( ...fetchPromiseCallArgs )
            .then( this._handleFetchErrors )
            .then( response => response.json() )
            .then( response => {
                this._persistResponse( { urlWithParams, response, cacheExpireInMs } )
                return response
            })
            .finally( () => {
                this._clearAjaxRequestPromise( urlWithParams );
            });
        
        if (isCached) {
            this._persistAjaxRequestPromise({ urlWithParams, ajaxPromise: fetchPromise })
        }
        
        return fetchPromise
    }


    _makeRequest ({
        url,
        data = null,
        params = null,
        headers = null,
        method,
    }) {
        const defaultOptions = {
            method,
        }

        const urlWithParams = this._addParamsToUrl(url, params)

        const fetchOptions = this._addBodyToOptions(defaultOptions, data)
        const options = this._addHeadersToOptions(fetchOptions, headers)
        const fetchPromiseCallArgs = this._getFetchArgs(urlWithParams, options)

        return window.fetch( ...fetchPromiseCallArgs )
            .then( this._handleFetchErrors )
            .then( response => response.json() )
    }


    post ({
        url,
        data = null,
        params = null,
        headers = null,
    }) {
        return this._makeRequest({
            url,
            data,
            params,
            headers,
            method: 'post'
        })
    }


    put ({
        url,
        data = null,
        params = null,
        headers = null,
    }) {
        return this._makeRequest({
            url,
            data,
            params,
            headers,
            method: 'put'
        })
    }


    patch ({
        url,
        data = null,
        params = null,
        headers = null,
    }) {
        return this._makeRequest({
            url,
            data,
            params,
            headers,
            method: 'patch'
        })
    }


    delete ({
        url,
        data = null,
        params = null,
        headers = null,
    }) {
        return this._makeRequest({
            url,
            data,
            params,
            headers,
            method: 'delete'
        })
    }
}


const defaultInstance = new Fetcher()

export default defaultInstance
