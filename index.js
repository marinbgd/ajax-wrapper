class Ajax {
    constructor () {
        this.cache = {}
    }

    get ({
        url,
        params = null, 
        headers = null, 
        isCached = false,
    }) {
        const urlWithParams = this._addParamsToUrl(url, params)
        const options = this._addHeadersToOptions(headers)
        const fetchPromiseCallArgs = this._getFetchArgs(urlWithParams, options)
        
        if (isCached && this._isUrlAlreadyInCache(urlWithParams)) {
            return this.cache[urlWithParams]
        }
    
        let fetchPromise = window.fetch(...fetchPromiseCallArgs)
            .then(this._handleFetchErrors)
            .then(response => response.json())
        
        if (isCached) {
            this.cache[urlWithParams] = fetchPromise
        }
    
        return fetchPromise
    }
    
    _isUrlAlreadyInCache (urlWithParams) {
        return !!this.cache[urlWithParams]
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
    
        const newHeaders = new Headers(headers)
        return {
            ...options,
            headers: newHeaders
        }
    }
    
    resetCache () {
        this.cache = {}
    }
}


const defaultAjaxInstance = new Ajax()

export default defaultAjaxInstance
