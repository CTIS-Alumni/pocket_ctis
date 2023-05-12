import { Navbar, Container, Nav, Form, Button } from 'react-bootstrap'
import AcademicUpdates from '../AcademicUpdates/AcademicUpdates'
import SearchBar from '../SearchBar/SearchBar'
import WorkUpdates from '../WorkUpdates/WorkUpdates'
import { useRouter } from 'next/router'
import styles from './UsersInfoPanel.module.scss'
import departmentConfig from '../../config/departmentConfig'

const UsersInfoPanel = ({work, edu}) => {
  const router = useRouter()

  const onSearch = ({ searchValue }) => {
    if (searchValue.length > 0) {
      router.push({
        pathname: '/user/search',
        query: { searchValue },
        as: '/user/search',
      })
    }
  }

  return (
    <section className={styles.panel}>
      <div className={styles.panel_welcome}>
        <h1 className={styles.welcome_logo}>{departmentConfig.app_name}</h1>
        <span className={styles.welcome_message}>Welcome back, </span>
        <span className={styles.welcome_name_surname}>Name Surname</span>
      </div>
      <SearchBar onSubmit={onSearch} />
      <div>
        <WorkUpdates work = {work}/>
        <AcademicUpdates edu = {edu}/>
      </div>
    </section>
  )
}

export default UsersInfoPanel
