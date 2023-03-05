import {isEqual} from "lodash";

export const submitChanges = async (url, requestObj) => {
    console.log(requestObj);
    let responseObj = {POST: {}, PUT: {}, DELETE: {}}
    if (requestObj.hasOwnProperty("POST") && requestObj.POST.length > 0) {
        responseObj.POST = await _submitFetcher("POST", url, requestObj.POST);
    }
    if (requestObj.hasOwnProperty("PUT") && requestObj.PUT.length > 0) {
        responseObj.PUT= await _submitFetcher("PUT", url, requestObj.PUT);

    }
    if (requestObj.hasOwnProperty("DELETE") && requestObj.DELETE.length > 0) {
        responseObj.DELETE = await _submitFetcher("DELETE", url, requestObj.DELETE);
    }

    return responseObj;
}

export const _submitFetcher = async (method, url, body) => {
    const res = await fetch(url, {
        headers: {
            'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
        },
        method: method,
        body: JSON.stringify(body)
    })
    return await res.json()
}

export const _getFetcher = async (url) => {
    const res = await fetch(url, {
        headers: {
            'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
        },
    })
    return await res.json()
}

export const createReqObject = (originalData, finalData, deletedData) => {
    let requestObj = {POST: [], PUT: [], DELETE: []};
    finalData.forEach((item) => {
        if (!item.hasOwnProperty("id"))
            requestObj.POST.push(item);
        else {
            const originalItem = originalData.find(datum => datum.id === item.id)
            if (!isEqual(originalItem, item))
                requestObj.PUT.push(item)
        }
    });
    requestObj.DELETE = deletedData;

    return requestObj;

}


