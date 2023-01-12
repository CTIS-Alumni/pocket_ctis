import { Formik, Field, Form } from 'formik'
import styles from './InstantSearch.module.scss'

const InstantSearch = ({searchValue = '', data, filtered, locale, changeLocale, name_string}) => {
    function search(e){
        let val = e.target.value;
        if(locale == "en-US")
            val = val.replace(/ğ/gim, "g")
                .replace(/ü/gim, "u")
                .replace(/ş/gim, "s")
                .replace(/ı/gim, "i")
                .replace(/ö/gim, "o")
                .replace(/ç/gim, "c");
        searchValue = val;
    }
    if(locale === "en-US"){
        filtered = searchValue === "" ? data :  data.filter(item => (item[name_string]
            .replace(/\s/g, '')
            .replace(/ğ/gim, "g")
            .replace(/ü/gim, "u")
            .replace(/ş/gim, "s")
            .replace(/ı/gm, "i")
            .replace(/İ/gm, "i")
            .replace(/ö/gim, "o")
            .replace(/ç/gim, "c")
            .toLocaleUpperCase(locale).includes(searchValue.replace(/\s/g, '').toLocaleUpperCase(locale))));
        setFiltered(filtered);
    }else{
        filtered = searchValue === "" ? data :  data.filter(item => (item[name_string].replace(/\s/g, '')
            .toLocaleUpperCase(locale).includes(searchValue.toLocaleUpperCase(locale).replace(/\s/g, ''))));
        setFiltered(filtered);
    }

    return (
        <div className={styles.search}>
            <Formik
                initialValues={{ searchValue: searchValue }}
                enableReinitialize
            >
                <Form className={styles.search_form}
                onChange={search}>
                    <Field
                        className={styles.search_bar}
                        id='searchValue'
                        name='searchValue'
                        placeholder='Please enter...'
                    />
                </Form>
            </Formik>
        </div>
    )
}

export default InstantSearch
