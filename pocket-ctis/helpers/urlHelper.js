export const craftUserUrl = (user_id, api) => {
    return process.env.NEXT_PUBLIC_BACKEND_PATH + "/users/" + user_id + "/" + api;
}

export const craftPathUrl = (paths, conditions = []) => {
    let url = process.env.NEXT_PUBLIC_BACKEND_PATH;
    paths.forEach((path)=>{
        url += "/" + path;
    });
    if(conditions.length > 0){
        url += "?";
        for(const condition in conditions){
            url += condition.name + "=" + condition.value + "&";
        }
        url = url.slice(0,-1);
    }
    return url;
}

//writes dynamic url with conditions
export const craftUrl = (api, conditions = []) => {
    let url = process.env.NEXT_PUBLIC_BACKEND_PATH +  "/" + api;
    if(conditions.length > 0){
        url += "?";
        conditions.forEach((condition)=>{
            url += condition.name + "=" + condition.value + "&";
        });
        url = url.slice(0,-1);
    }
    return url;
}

