/*const INITIAL_STATE = {
    lastSearch: "",
    searchCol: ["company_name, sector_name"],
    sort: {column: "company_name", "asc"},
    filtered: companies,
    limit: 15,
    page: 1,
    num: count,
    totalPage: Math.ceil(count/limit),
}*/

export const listSearchReducer = (state, action) => {
    switch (action.type){
        case "CHANGE_LAST_SEARCH":
            return{
                ...state,
                lastSearch: action.payload.lastSearch,
                page: 1
            };
        case "RESET_SEARCH":
            return{
                ...state,
                lastSearch: "",
            }
        case "CHANGE_PAGE":
            return {
                ...state,
                page: action.payload.page,
            };
        case "CHANGE_RESULTS":
            return {
                ...state,
                filtered: action.payload.filtered,
            }
        case "CHANGE_LIMIT":
            return{
                ...state,
                limit: action.payload.limit
            };
        case "CHANGE_SORT":
            return{
                ...state,
                sort: {column: action.payload.column, order: action.payload.order}
            };
        case "CHANGE_TOTAL_PAGE":
            return{
                ...state,
                totalPage: action.payload.totalPage
            };
        case "CHANGE_NUM":
            return {
                ...state,
                num: action.payload.num
            };
        case "CHANGE SEARCH_COL":
            return{
                ...state,
                searchCol: action.payload.searchCol
            }
        default:
            return state;
    }
}
