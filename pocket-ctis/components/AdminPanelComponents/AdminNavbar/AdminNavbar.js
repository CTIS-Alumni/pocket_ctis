import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import departmentConfig from '../../../config/departmentConfig'
import styles from './AdminNavbar.module.scss'
import {_getFetcher} from "../../../helpers/fetchHelpers";
import {craftUrl} from "../../../helpers/urlHelper";
import {useRouter} from "next/router";
import {useContext} from "react";
import {User_data} from "../../../context/userContext";

const AdminNavbar = () => {
  const router = useRouter();
  const { setUserData } = useContext(User_data);

  const requestLogout = async () => {
    const {logout} = await _getFetcher({logout: craftUrl(['logout'])});
    setUserData(null);
    router.push('/login' )
  }

  const returnToUserPage = async () => {
    const {res} = await _getFetcher({res: craftUrl(['logout'], [{name: "adminPanel", value: 1}])})
    if(res.data){
      router.push('/user' );
    }else{
      //TODO: SHOW ERROR TOAST
    }
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
            <NavDropdown.Item onClick={returnToUserPage}>User Panel</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar>
    </>
  )
}

export default AdminNavbar
