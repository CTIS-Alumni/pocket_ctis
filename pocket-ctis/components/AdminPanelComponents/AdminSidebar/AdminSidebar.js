import { Container } from 'react-bootstrap'
import styles from './AdminSidebar.module.scss'
import Link from 'next/link'
import { DatabaseFillAdd, PeopleFill, Search } from 'react-bootstrap-icons'

const Button = ({ children, href, icon }) => {
  return (
    <Link href={href} className={styles.sidebarBtn}>
      {icon}
      {children}
    </Link>
  )
}

const AdminSidebar = () => {
  return (
    <div className={styles.sidebar}>
      <img src='/test.jpeg' className={styles.sidebarImg} />
      <div className={styles.userTitle}>Admin User</div>
      <Button href='/admin/users' icon={<PeopleFill />}>
        Users
      </Button>
      <Button href='/admin/dataInsertion' icon={<DatabaseFillAdd />}>
        Data Insertion
      </Button>
      <Button href='/admin/reportGeneration' icon={<Search />}>
        Report Generation
      </Button>
    </div>
  )
}

export default AdminSidebar
