//writes dynamic url with conditions
export const craftUrl = (apis, conditions = []) => {
    let url = process.env.NEXT_PUBLIC_BACKEND_PATH;
    apis.forEach((api)=>{
        url += "/" + api;
    });
    if(conditions.length > 0){
        url += "?";
        conditions.forEach((condition)=>{
            url += condition.name + "=" + condition.value + "&";
        });
        url = url.slice(0,-1);
    }
    return url;
}


export const buildCondition = (queryParams) => {
    let conditions = [];
    for(const [key, value] of Object.entries(queryParams)){
        if(value !== "")
            conditions.push({name: key, value: value});

    }
    return conditions;
}

