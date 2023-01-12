import { Formik, Field, Form } from 'formik'
import styles from './SearchBar.module.scss'

const SearchBar = ({ onSubmit, searchValue = '' }) => {
  return (
    <div className={styles.search}>
      <Formik
        initialValues={{ searchValue: searchValue }}
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
          <button type='submit' className={styles.search_button}>
            Search
          </button>
        </Form>
      </Formik>
    </div>
  )
}

export default SearchBar
