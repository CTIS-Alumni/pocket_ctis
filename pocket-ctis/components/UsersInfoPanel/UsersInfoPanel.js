import { Navbar, Container, Nav, Form, Button } from 'react-bootstrap'
import AcademicUpdates from '../AcademicUpdates/AcademicUpdates'
import WorkUpdates from '../WorkUpdates/WorkUpdates'
import { useRouter } from 'next/router'
import styles from './UsersInfoPanel.module.scss'

const UsersInfoPanel = ({work, edu}) => {
  return (
    <section className={styles.panel}>
      <div className={styles.panel_welcome}>
        <h1 className={styles.welcome_logo}>PocketCTIS</h1>
        <span className={styles.welcome_message}>Welcome back, </span>
        <span className={styles.welcome_name_surname}>Name Surname</span>
      </div>
      <div>
        <WorkUpdates work = {work}/>
        <AcademicUpdates edu = {edu}/>
      </div>
    </section>
  )
}

export default UsersInfoPanel
