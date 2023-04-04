import React from 'react'
import { Nav, NavDropdown, Navbar } from 'react-bootstrap'

import styles from './NavigationBar.module.scss'

const NavigationBar = () => {
  return (
    <>
      <Navbar className={styles.navbar}>
        <Navbar.Brand href='/user' className={styles.navbar_logo}>
          PocketCTIS
        </Navbar.Brand>
        <Nav className='d-flex justify-content-end'>
          <NavDropdown
            title='User'
            className='justify-content-end'
            drop='start'
          >
            <NavDropdown.Item href='#action4'>Logout</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href='/admin'>Admin Panel</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar>
    </>
  )
}

export default NavigationBar
