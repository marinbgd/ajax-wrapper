import { 
    _handleFetchErrors,
    _getFetchArgsArray,
    _addParamsToUrl,
    _addHeadersToOptions,
    _addBodyToOptions,
    _isCachedResponseExisting,
    _isCachedResponseValid,
 } from './index.helper'


const MINUTE_IN_MS = 60000
const DEFAULT_FETCH_CACHE_TIME = MINUTE_IN_MS; 


class Fetcher {
    constructor () {
        this.cache = {}
    }

    _getCachedResponseByUrl ( cache, urlWithParams ) {
        return Promise.resolve( cache[urlWithParams].response );
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
        const urlWithParams = _addParamsToUrl(url, params)
        
        if ( isCached && this._isAjaxRequestInProgress( urlWithParams ) ) {
            return this._getAjaxRequestInProgress( urlWithParams );
        }

        if (
            isCached &&
            _isCachedResponseExisting( { cache: this.cache, urlWithParams, } ) &&
            _isCachedResponseValid( { cache: this.cache, urlWithParams, cacheExpireInMs } )
        ) {
            return this._getCachedResponseByUrl( this.cache, urlWithParams );
        }

        const options = _addHeadersToOptions(null, headers)
        const fetchPromiseCallArgs = _getFetchArgsArray(urlWithParams, options)
    
        let fetchPromise = window.fetch( ...fetchPromiseCallArgs )
            .then( _handleFetchErrors )
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

        const urlWithParams = _addParamsToUrl(url, params)

        const fetchOptions = _addBodyToOptions(defaultOptions, data)
        const options = _addHeadersToOptions(fetchOptions, headers)
        const fetchPromiseCallArgs = _getFetchArgsArray(urlWithParams, options)

        return window.fetch( ...fetchPromiseCallArgs )
            .then( _handleFetchErrors )
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
