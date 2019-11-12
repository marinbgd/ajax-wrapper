const get = ({url, params = null, headers = null}) => {
    const urlWithParams = _addParamsToUrl(url, params)
    const options = _addHeadersToOptions(headers)
    const fetchPromiseCallArgs = _getFetchArgs(urlWithParams, options)
    
    return window.fetch(...fetchPromiseCallArgs)
        .then(response => response.json())
        .catch(console.log)
}

const _getFetchArgs = (urlWithParams, options) => {
    let fetchPromiseCallArgs = [urlWithParams]
    if (options) {
        fetchPromiseCallArgs = [urlWithParams, options]
    }
    return fetchPromiseCallArgs
}

const _getEncodedParams = params => {
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
const _addParamsToUrl = (url, params) => {
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

const _addHeadersToOptions = (options = {}, headers = null) => {
    if (!headers) {
        return options
    }

    const newHeaders = new Headers(headers)
    return {
        ...options,
        headers: newHeaders
    }
}

export default {
    get,
}