import {isEqual} from "lodash";
import {craftDefaultUrl} from "./urlHelper";

//divides the incoming requests based on type, priority is delete > put > post
export const submitChanges = async (url, requestObj) => {
    let responseObj = {POST: {}, PUT: {}, DELETE: {}}
    if (requestObj.hasOwnProperty("DELETE") && requestObj.DELETE.length > 0) {
        responseObj.DELETE = await _submitFetcher("DELETE", url, requestObj.DELETE);
    }
    if (requestObj.hasOwnProperty("PUT") && requestObj.PUT.length > 0) {
        responseObj.PUT= await _submitFetcher("PUT", url, requestObj.PUT);
    }
    if (requestObj.hasOwnProperty("POST") && requestObj.POST.length > 0) {
        responseObj.POST = await _submitFetcher("POST", url, requestObj.POST);
    }

    return responseObj;
}

export const _submitFetcher = async (method, url, body) => {
    const res = await fetch(url, {
        headers: {
            'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
        },
        method: method,
        credentials: 'include',
        body: JSON.stringify(body)
    })
    return await res.json()
}

export const _getFetcher = async (url) => { // when you need to fetch a single api
    const res = await fetch(url, {
        headers: {
            'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
        },
        credentials: 'include'
    })
    return await res.json()
}

export const _getFetcherMulti = async (apis) => {
    let results = {};
    try{
        await Promise.all(apis.map(async (api)=>{
            const res = await fetch(craftDefaultUrl(api), { //send api's instead of full url's to create a results object with api names as keys
                headers: {
                    'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
                },
                credentials: 'include'
            });
            results[api] = await res.json();
        }));
        return results;
    }catch(error){
        console.log(error);
        //stuff
    }
}

export const createReqObject = (originalData, finalData, deletedData) => {
    let requestObj = {POST: [], PUT: [], DELETE: []};
    finalData.forEach((item) => {
        if (!item.hasOwnProperty("id")){ //if it doesnt have id its a POST
            requestObj.POST.push(item);
        }
        else {
            const originalItem = originalData.find(datum => datum.id === item.id) //try to find the data with the same id from the original data
                if (!isEqual(originalItem, item))
                    requestObj.PUT.push(item) //if you find it and they're not equal its a PUT
        }
    });
    requestObj.DELETE = deletedData;

    return requestObj;

}


