export const craftUserUrl = (user_id, api) => {
    return process.env.NEXT_PUBLIC_BACKEND_PATH + "/users/" + user_id + "/" + api;
}

export const craftDefaultUrl = (api) => {
    return process.env.NEXT_PUBLIC_BACKEND_PATH +  "/" + api;
}

