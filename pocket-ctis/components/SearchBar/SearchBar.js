import { Row, Col, Form, Button } from 'react-bootstrap'
import styles from './SearchBar.module.scss'

const SearchBar = () => {
  return (
    <div className={styles.search}>
      <Form className={styles.search_form}>
        <Form.Control
          type='search'
          placeholder='Search'
          className={styles.search_bar}
          aria-label='Search'
        />
        <Button className={styles.search_button}>
          Search
        </Button>
      </Form>
    </div>
  )
}

export default SearchBar
