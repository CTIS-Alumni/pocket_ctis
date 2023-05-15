import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import departmentConfig from '../../../config/departmentConfig'
import styles from './AdminNavbar.module.scss'
import {logout} from "../../../helpers/fetchHelpers";
import {useRouter} from "next/router";
import {useContext} from "react";
import {User_data} from "../../../context/userContext";
import {toast} from "react-toastify";

const AdminNavbar = () => {
  const router = useRouter();
  const { setUserData } = useContext(User_data);

  const requestLogout = async () => {
    const res = await logout();
    if (res.data && !res.errors) {
      toast.success('Logged out successfully.')
      setUserData(null)
      router.push('/login' )
      return false;
    }else{
      toast.error(res.errors[0].error)
    }
  }

  const returnToUserPage = async () => {
    const res = await logout("adminPanel");
    if (res.data && !res.errors) {
      toast.success('Logged out of admin mode successfully.')
      router.push('/user' );
      return false;
    }else{
      toast.error(res.errors[0].error)
    }
  }

  const goToSettings = async () => {
    router.push('/admin/settings')
  }

  return (
    <>
      <Navbar className={styles.navbar} fixed='top'>
        <Navbar.Brand href='/admin' className={styles.navbar_logo}>
          {departmentConfig.app_name}
        </Navbar.Brand>
        <Nav className='d-flex justify-content-end'>
          <NavDropdown
            title='User'
            className='justify-content-end'
            drop='start'
          >
            <NavDropdown.Item onClick={requestLogout}>Logout</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={goToSettings}>Settings</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={returnToUserPage}>User Panel</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar>
    </>
  )
}

export default AdminNavbar
