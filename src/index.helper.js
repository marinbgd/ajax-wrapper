export const isEmptyObject = (object) => {
    return (Object.keys(object).length === 0)
}

export const _handleFetchErrors = (fetchResponse) => {
    if (!fetchResponse.ok) {
        throw Error(fetchResponse.statusText);
    }
    return fetchResponse;
}

export const _getFetchArgsArray = (urlWithParams, options) => {
    let fetchPromiseCallArgs = [urlWithParams]
    if (options) {
        fetchPromiseCallArgs = [urlWithParams, options]
    }
    return fetchPromiseCallArgs
}

export const _getEncodedParams = (params) => {
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

export const _addParamsToUrl = (url, params) => {
    if (!params) {
        return url
    }

    const encodedParams = _getEncodedParams(params)
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

export const _addHeadersToOptions = (options = {}, headers = null) => {
    if (!headers) {
        return options
    }

    return {
        ...options,
        headers: {
            ...(options && options.headers),
            ...headers,
        },
    }
}

export const _addBodyToOptions = (options = {}, data = null) => {
    if (!data) {
        return options
    }

    return {
        ...options,
        body: JSON.stringify(data),
    }
}

export const _isCachedResponseExisting = ( { cache, urlWithParams} ) => {
    return ( !! ( cache[urlWithParams] && cache[urlWithParams].response ) )
}

export const _isCachedResponseValid = ( {  cache, urlWithParams, cacheExpireInMs } ) => {
    const cachedResponse = cache[urlWithParams]
    const cacheTimeMs = cachedResponse.timestamp.getTime()
    const timeNowInMs = new Date().getTime()
    const diffInMs = timeNowInMs - cacheTimeMs
    return ( diffInMs < cacheExpireInMs )
}