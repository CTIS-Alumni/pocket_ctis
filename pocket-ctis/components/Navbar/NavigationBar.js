import React, { useContext } from 'react'
import { Nav, NavDropdown, Navbar } from 'react-bootstrap'
import departmentConfig from '../../config/departmentConfig'

import styles from './NavigationBar.module.scss'
import { logout } from '../../helpers/fetchHelpers'
import { useRouter } from 'next/router'
import { User_data } from '../../context/userContext'
import { toast } from 'react-toastify'

import { List, ThreeDotsVertical } from 'react-bootstrap-icons'
import Link from 'next/link'
import { useState } from 'react'
import { getAppLogoPath } from '../../helpers/formatHelpers'
import SearchBar from "../SearchBar/SearchBar";

const NavigationBar = ({ setToggleSidebar }) => {
  const router = useRouter()
  const { setUserData } = useContext(User_data)
  const context = useContext(User_data)

  const requestLogout = async () => {
    const res = await logout()
    if (res.data && !res.errors) {
      toast.success('Logged out successfully.')
      setUserData(null)
      router.push('/login')
      return false
    } else {
      toast.error(res.errors[0].error)
    }
  }

  const adminLoginPage = async () => {
    router.push('/user/adminLogin')
  }

  const Button = ({ icon, onclick }) => {
    return (
      <button onClick={onclick} className={styles.icon_button}>
        {icon}
      </button>
    )
  }

  // const [toggleSidebar, setToggleSidebar] = useState(false);

  function sidebar() {
    setToggleSidebar((prev) => !prev)
  }

  return (
    <>
      <Navbar className={styles.navbar}>
        <div className={styles.wrapper}>
          <Button onclick={sidebar} icon={<ThreeDotsVertical />} />
          <Navbar.Brand href='/user' className={styles.navbar_logo}>
            {getAppLogoPath() ? (
              <img src={getAppLogoPath()} style={{ paddingBottom: 10 }} />
            ) : (
              departmentConfig.app_name
            )}
          </Navbar.Brand>
        </div>
        <Nav className='d-flex justify-content-end align-items-center'>
          <Nav.Item
            style={{ marginRight: 20, cursor: 'pointer' }}
            onClick={() => router.push('/user/add')}
          >
            Add Entities
          </Nav.Item>
          <NavDropdown
            title='User'
            className='justify-content-end'
            drop='start'
          >
            <NavDropdown.Item onClick={() => router.push('/user/requests')}>
              Requests
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={() => router.push('/user/settings')}>
              Settings
            </NavDropdown.Item>
            {context.userData?.user_types.includes('admin') && <>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={adminLoginPage}>
                Admin Panel
              </NavDropdown.Item>
            </>}
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={requestLogout}>Logout</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar>
    </>
  )
}

//check context or wherever and see if user types only to admin
export default NavigationBar
