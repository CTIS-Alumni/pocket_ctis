export const craftUserUrl = (user_id, api) => {
    return process.env.NEXT_PUBLIC_BACKEND_PATH + "/users/" + user_id + "/" + api;
}



