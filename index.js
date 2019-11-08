const get = ({url, params = null}) => {
    console.log(params)

    const urlWithParams = _addParamsToUrl(url, params)

    return window.fetch(urlWithParams)
        .then(response => response.json())
}

const _addParamsToUrl = (url, params) => {
    if (!params) {
        return url
    }

    const keys = Object.keys(params)
    const orderedKeys = keys.sort()
    let urlWithQuery = url
    orderedKeys.forEach((key, index) => {
        if (index === 0) {
            urlWithQuery += `?${key}=${params[key]}`
        } else {
            urlWithQuery += `&${key}=${params[key]}`
        }
    })

    return urlWithQuery
}

export default {
    get,
}