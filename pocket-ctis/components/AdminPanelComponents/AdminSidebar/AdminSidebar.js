import { Container } from 'react-bootstrap'
import styles from './AdminSidebar.module.scss'
import Link from 'next/link'
import {
  Boxes,
  DatabaseFillAdd,
  PeopleFill,
  PlusSquare,
  PlusSquareFill,
  Search,
} from 'react-bootstrap-icons'
import { useContext, useState, useEffect } from 'react'
import { User_data } from '../../../context/userContext'
import { getProfilePicturePath } from '../../../helpers/formatHelpers'

const Button = ({ children, href, icon }) => {
  return (
    <Link href={href} className={styles.sidebarBtn}>
      {icon}
      {children}
    </Link>
  )
}

const AdminSidebar = () => {
  const { userData } = useContext(User_data)

  return (
    <div className={styles.sidebar}>
      <img
        src={getProfilePicturePath(userData?.profile_picture)}
        className={styles.sidebarImg}
      />
      <div className={styles.userTitle}>
        {userData?.first_name} {userData?.last_name}
      </div>
      <Button href='/admin/users' icon={<PeopleFill />}>
        Users
      </Button>
      <Button href='/admin/dataInsertion' icon={<DatabaseFillAdd />}>
        Data Insertion
      </Button>
      <Button href='/admin/reportGeneration' icon={<Search />}>
        Report Generation
      </Button>
      <Button href='/admin/moduleCustomization' icon={<Boxes />}>
        Module Customization
      </Button>
      <Button href='/admin/addEntities' icon={<PlusSquare />}>
        Add Entities
      </Button>
    </div>
  )
}

export default AdminSidebar
