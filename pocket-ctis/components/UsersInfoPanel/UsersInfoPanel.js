import { Navbar, Container, Nav, Form, Button } from 'react-bootstrap'
import AcademicUpdates from '../AcademicUpdates/AcademicUpdates'
import WorkUpdates from '../WorkUpdates/WorkUpdates'

import styles from './UsersInfoPanel.module.scss'

const UsersInfoPanel = () => {
  return (
    <section className={styles.panel}>
      <div className={styles.panel_welcome}>
        <h1 className={styles.welcome_logo}>PocketCTIS</h1>
        <span className={styles.welcome_message}>Welcome back, </span>
        <span className={styles.welcome_name_surname}>Name Surname</span>
      </div>
      <Form className={styles.panel_search}>
        <Form.Control
          type='search'
          placeholder='Search'
          className=''
          aria-label='Search'
        />
        <Button className={styles.panel_search_button}>
          Search
        </Button>
      </Form>
      <div>
        <WorkUpdates />
        <AcademicUpdates />
      </div>
    </section>
  )
}

export default UsersInfoPanel
