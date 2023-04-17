import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import styles from './AdminNavbar.module.scss'

const AdminNavbar = () => {
  return (
    <>
      <Navbar className={styles.navbar} fixed='top'>
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
            <NavDropdown.Item href='/user'>User Panel</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar>
    </>
  )
}

export default AdminNavbar
