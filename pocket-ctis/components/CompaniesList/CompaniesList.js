import {Check} from 'react-bootstrap-icons'
import styles from './CompaniesList.module.scss'
import ListSearch from "../ListSearch/ListSearch";
import {useCallback, useEffect, useReducer, useRef} from "react";
import SortableHeader from "../SortableHeader/SortableHeader";
import {fetchResults, fetchCount} from "../../helpers/searchHelpers";
import PageNavigation from "../PageNavigation/PageNavigation";
import {listSearchReducer} from "../../helpers/ListSearchReducer";

const CompaniesList = ({companies, count}) => {
    const INITIAL_STATE = {
        lastSearch: "",
        searchCol: ["company_name", "sector_name"],
        sort: {column: "company_name", order: "asc"},
        filtered: companies,
        limit: 15,
        page: 1,
        num: count,
        totalPage: Math.ceil(count / 15)
    }

    const renderCount = useRef(0);
    useEffect(() => {
        renderCount.current = renderCount.current + 1;
    });

    const [state, dispatch] = useReducer(listSearchReducer, INITIAL_STATE);
    const changeLastSearch = (value = "", cols = ["company_name", "sector_name"]) => {
        dispatch({type: "CHANGE_LAST_SEARCH", payload: {lastSearch: value}});
    }

    const resetSearch = async () => {
        dispatch({type: "RESET_SEARCH"});
    }

    const changeResults = useCallback(async () => {
        const temp =Math.ceil(state.num / state.limit);
        if(state.page <= temp && state.page >= 1){
            const data = await fetchResults(state.limit, state.page, "companies", state.sort.column, state.sort.order, state.lastSearch, state.searchCol);
            dispatch({type: "CHANGE_RESULTS", payload: {filtered: data}});
        }
    }, [state.sort, state.page, state.limit, state.lastSearch]);

    useEffect(() => {
        changeResults();
    }, [changeResults]);

    const changeCount = useCallback(async () => {
        const count = await fetchCount("companies", state.lastSearch, state.searchCol);
        dispatch({type: "CHANGE_NUM", payload: {num: count}});
    }, [state.lastSearch]);

    useEffect(() => {
        changeCount();
    }, [changeCount]);

    const changeTotalPage = () => {
        const newTotalPage = Math.ceil(state.num / state.limit);
        dispatch({type: "CHANGE_TOTAL_PAGE", payload: {totalPage: newTotalPage}});
        if (state.page > newTotalPage)
            dispatch({type: "CHANGE_PAGE", payload: {page: newTotalPage}});
        else if (state.page < 1)
            dispatch({type: "CHANGE_PAGE", payload: {page: 1}});
    };

    useEffect(() => {
        changeTotalPage();
    }, [state.num, state.limit]);

    const changeSort = (column) => {
        if (column != state.sort.column)
            dispatch({type: "CHANGE_SORT", payload: {column: column, order: "asc"}});
        else {
            let order;
            if (state.sort.order == "asc")
                order = "desc";
            else order = "asc";
            dispatch({type: "CHANGE_SORT", payload: {column: column, order: order}});
        }
    }

    const changeLimit = (e) => {
        if (state.limit !== e.target.value)
            dispatch({type: "CHANGE_LIMIT", payload: {limit: e.target.value}});
    }

    const changePage = (e) => {
        if (state.page !== e.target.value)
            dispatch({type: "CHANGE_PAGE", payload: {page: e.target.value}});
    }


    return (
        <div className={styles.companies}>
            <h2 className='custom_table_title'>Companies: {renderCount.current}</h2>
            <div className={styles.companies_filters}>
                <span className={styles.companies_filters_title}>Filters:</span>
                <form className={styles.companies_filters_form}>
                    <input
                        type='checkbox'
                        className={styles.companies_filters_form_check}
                        id='chk_accepts_internships'
                    />
                    <label
                        className={styles.companies_filters_form_label}
                        htmlFor='chk_accepts_internships'
                    >
                        Accepts Internships
                    </label>

                    <input type='checkbox'
                           className={styles.companies_filters_form_check}
                           id='chk_not_accept_internships'
                    />
                    <label
                        className={styles.companies_filters_form_label}
                        htmlFor='chk_not_accept_internships'
                    >
                        Doesn't Accept Internships
                    </label>
                </form>
            </div>
            <div>
                <span className={styles.left}>
                    Show
                    <select onChange={changeLimit}>
                    <option value={15}>15</option>
                    <option value={30}>30</option>
                </select>
                    entries
                </span>
                <div className={`${styles.companies_search_bar} ${styles.right}`}>
                    <ListSearch resetSearch={resetSearch} changeLastSearch={changeLastSearch}
                                lastSearch={state.lastSearch}/>
                </div>
            </div>
            <span>
                {state.num > 0 ? `Showing ${(parseInt(state.page) - parseInt(1)) * parseInt(state.limit) + parseInt(1)} to ${state.num < state.limit ? (parseInt(state.num)) : (state.page == state.totalPage) ? ((parseInt(state.totalPage) - parseInt(1)) * parseInt(state.limit) + parseInt(state.num) - ((parseInt(state.totalPage) - parseInt(1)) * parseInt(state.limit))) : (state.page * state.limit)} of ${state.num} entries` : `No results found`}
            </span>
            {state.num > 0 && <table className='custom_table'>
                <thead>
                <tr>
                    <SortableHeader sort={state.sort} changeSort={changeSort} column_name="Company"
                                    field_name="company_name"/>
                    <SortableHeader sort={state.sort} changeSort={changeSort} column_name="Sector"
                                    field_name="sector_name"/>
                    <th>Accepts Internships</th>
                </tr>
                </thead>
                <tbody>
                {state.filtered.map((company, i) => (
                    <tr className='hoverable' key={i}>
                        <td>
                            <a
                                className={`${styles.company_link} link`}
                                href={`/user/companies/${company.id}`}
                            >
                                {company.company_name}
                            </a>
                        </td>
                        <td>
                            <a className={`${styles.company_link} link`}
                               href={`/user/sectors/${company.sector_id}`}>{company.sector_name}</a>
                        </td>
                        <td>
                <span>
                  {company.is_internship == 1 && (
                      <div className={styles.internship_badge}>
                          <Check/>
                      </div>
                  )}
                </span>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>}
            {state.num > 0 &&
                <PageNavigation page={state.page} changePage={changePage}
                                pageDisplay={5} totalPage={state.totalPage}/>}
        </div>
    )
}


export default CompaniesList

