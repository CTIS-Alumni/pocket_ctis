import NavigationBar from '../../navbar/NavigationBar'
import AdminNavbar from '../AdminNavbar/AdminNavbar'
import AdminSidebar from '../AdminSidebar/AdminSidebar'
import { Container } from 'react-bootstrap'

const AdminPageContainer = ({ children }) => {
  return (
    <div
      style={{
        background: '#f5f5f5',
        width: '100%',
        height: '100vh',
      }}
    >
      <AdminNavbar />
      <div
        style={{
          display: 'flex',
          height: '100%',
          paddingTop: '60px',
        }}
      >
        <AdminSidebar />
        <Container style={{ padding: '30px', overflowY: 'scroll' }}>
          {children}
        </Container>
      </div>
    </div>
  )
}


export default AdminPageContainer
