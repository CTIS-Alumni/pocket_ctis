import NavigationBar from '../../components/navbar/NavigationBar'
import AdminSidebar from '../../components/AdminPanelComponents/AdminSidebar/AdminSidebar'

const AdminRoute = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexFlow: 'column',
      }}
    >
      <NavigationBar />
      <AdminSidebar />
    </div>
  )
}

export default AdminRoute
