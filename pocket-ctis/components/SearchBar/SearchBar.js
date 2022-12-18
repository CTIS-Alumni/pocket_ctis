import { Button } from 'react-bootstrap'
import { Formik, Field, Form } from 'formik'
import styles from './SearchBar.module.scss'
import { useState } from 'react'

const SearchBar = ({ onSubmit, searchValue = '' }) => {
  return (
    <div className={styles.search}>
      <Formik initialValues={{ searchValue: searchValue }} onSubmit={onSubmit}>
        <Form style={{ width: '100%', display: 'flex' }}>
          <label htmlFor='searchValue'>Search</label>
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
      {/* <Form onChange={onChange} className={styles.search_form}>
        <Form.Control
          type='search'
          placeholder='Search'
          className={styles.search_bar}
          aria-label='Search'
        />
        <Button className={styles.search_button}>Search</Button>
      </Form> */}
    </div>
  )
}

export default SearchBar
