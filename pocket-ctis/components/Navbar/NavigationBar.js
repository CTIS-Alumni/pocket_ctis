import React, {useContext} from 'react'
import { Nav, NavDropdown, Navbar } from 'react-bootstrap'
import departmentConfig from '../../config/departmentConfig'

import styles from './NavigationBar.module.scss'
import {_getFetcher} from "../../helpers/fetchHelpers";
import {craftUrl} from "../../helpers/urlHelper";
import {useRouter} from "next/router";
import { User_data } from '../../context/userContext'


const NavigationBar = () => {
  const router = useRouter();

  const requestLogout = async () => {
    const {logout} = await _getFetcher({logout: craftUrl(['logout'])});
      router.push('/login' )
  }

  const adminLoginPage = async () => {
    //const {res} = await _getFetcher({res: })
    router.push('/user/adminLogin')
  }


  return (
    <>
      <Navbar className={styles.navbar}>
        <Navbar.Brand href='/user' className={styles.navbar_logo}>
          {departmentConfig.app_name}
        </Navbar.Brand>
        <Nav className='d-flex justify-content-end'>
          <NavDropdown
            title='User'
            className='justify-content-end'
            drop='start'
          >
            <NavDropdown.Item href='#action4'>Settings</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={adminLoginPage}>Admin Panel</NavDropdown.Item>
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
