import React from 'react'
import { Navbar } from 'react-bootstrap'
import departmentConfig from '../../config/departmentConfig'

import styles from './NavigationBar.module.scss'

const NavigationBar = () => {
  return (
    <>
      <Navbar className={styles.navbar}>
        <Navbar.Brand
        href='/user'
        className={styles.navbar_logo}
        >
            {departmentConfig.app_name}
        </Navbar.Brand>
      </Navbar>
    </>
  )
}

export default NavigationBar
