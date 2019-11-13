const createDeferred = () => {
    let resolve
    let reject
    const promise = new Promise(( _resolve, _reject )=> {
        resolve = _resolve
        reject = _reject
    })

    return {
        promise,
        resolve,
        reject,
    }
}

export default createDeferred