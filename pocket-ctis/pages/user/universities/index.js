import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import UniversitiesList from '../../../components/UniversitiesList/UniversitiesList'

const UniversitiesDashboard = ({ universities }) => {
  return (
    <div style={{ height: '100vh' }}>
      <NavigationBar />
      <div className='d-flex' style={{ height: '100%' }}>
        <UserInfoSidebar />
        <UniversitiesList universities={universities} />
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  const res = await fetch('http://localhost:3000/api/educationinstitutes')
  const { educationinstitutes } = await res.json()
  return { props: { universities: educationinstitutes } }
}
export default UniversitiesDashboard
