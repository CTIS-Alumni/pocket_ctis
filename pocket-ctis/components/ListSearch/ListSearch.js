import { Formik, Field, Form } from 'formik'
import {Search, XSquare} from "react-bootstrap-icons";
import styles from './ListSearch.module.scss'
import {useRef} from "react";

const ListSearch = ({resetSearch, changeLastSearch, lastSearch}) => {
    const showLastSearch = useRef(false);

    const onSubmit = (value) => {
        if(value.searchValue.trim() != ""){
            showLastSearch.current = true;
            changeLastSearch(value.searchValue);
        }
    }

    const cancel = () => {
        if (lastSearch != "") {
            showLastSearch.current = false;
            resetSearch();
        }
    }

    return (
        <div>
            <div className={styles.search}>
                <Formik
                    initialValues={{ searchValue: "" }}
                    enableReinitialize
                    onSubmit={onSubmit}
                >
                    <Form className={styles.search_form}>
                        <Field
                            className={styles.search_bar}
                            id='searchValue'
                            name='searchValue'
                            placeholder='Please enter...'
                        />
                        <button type="submit"><Search /></button>
                    </Form>
                </Formik>
            </div>
            {showLastSearch.current &&
                <div className={styles.searchCard}>
                    <button onClick={cancel}><XSquare/></button>
                    <span>{lastSearch}</span>
                </div>}
        </div>
    )
}

export default ListSearch
