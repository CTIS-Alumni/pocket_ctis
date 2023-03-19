import { Formik, Field, Form } from 'formik'
import { XCircleFill } from 'react-bootstrap-icons'
import styles from './SearchBar.module.scss'

const SearchBar = ({ onSubmit, searchValue = '' }) => {
  const clearSearch = (val) => {
    if (val != '') {
      onSubmit({ searchValue: '' })
    }
  }

  return (
    <div className={styles.search}>
      <Formik
        initialValues={{ searchValue: searchValue }}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {(props) => (
          <Form className={styles.search_form}>
            <>
              <label className={styles.search_bar_label} htmlFor='searchValue'>
                Search
              </label>
              <div style={{ position: 'relative', width: '100%' }}>
                <Field
                  className={styles.search_bar}
                  id='searchValue'
                  name='searchValue'
                  placeholder='Please enter...'
                />
                <XCircleFill
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '1.3em',
                    fontSize: '10px',
                  }}
                  onClick={() => {
                    clearSearch(props.values.searchValue)
                    props.setFieldValue('searchValue', '')
                  }}
                />
              </div>
              <button type='submit' className={styles.search_button}>
                Search
              </button>
            </>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default SearchBar
