import {isEqual} from "lodash";
import {craftUrl} from "./urlHelper";

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
    try{
        const res = await fetch(url, {
            method: method,
            credentials: 'include',
            body: JSON.stringify(body)
        })
        return await res.json()
    }catch(error){
        return {errors: [{error: "An error occured!"}]};
    }
}

export const _submitFile = async (method, url, formData) => {
    try{
        const res = await fetch(url, {
            method: method,
            credentials: 'include',
            body: formData
        })
        return await res.json()
    }catch(error){
        return {errors: [{error: error.message}]};
    }
}

export const logout = async (queryParams) => {
    try{
        const url = queryParams ? craftUrl(["logout"], {name: 'adminPanel', value: 1}) : craftUrl(['logout']);
        const res = await fetch(url, {
            method: 'GET',
            credentials: 'include',
        });
        const results = await res.json();
        return results;
    }catch(error){
        return {errors: [{error: error.message}]};
    }
}

export const _getFetcher = async (apis,  cookies = null) => { // [{name: url}, {name: url}]
    let results = {}

    try{
        await Promise.all(Object.entries(apis).map(async ([api, url])=>{
            const res = await fetch(craftUrl(['proxy']), {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Cookie: cookies,
                    'x-url': url
                }
            });
            results[api] = await res.json();
        }));
        return results;
    }catch(error){
        return {errors: [{error: error.message}]};
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


