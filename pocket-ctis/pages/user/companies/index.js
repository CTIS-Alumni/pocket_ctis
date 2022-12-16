import CompaniesList from '../../../components/CompaniesList/CompaniesList'
import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'

const CompaniesDashboard = ({ companies }) => {
  return (
    <div style={{ height: '100vh' }}>
      <NavigationBar />
      <div className='d-flex' style={{ height: '100%' }}>
        <UserInfoSidebar />
        <CompaniesList companies={companies} />
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  const res = await fetch('http://localhost:3000/api/companies')
  const companies = await res.json()
  return { props: { companies } }
}

export default CompaniesDashboard
