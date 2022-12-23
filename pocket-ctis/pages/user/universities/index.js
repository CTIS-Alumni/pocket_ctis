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
  const res = await fetch(process.env.BACKEND_PATH + "/educationinstitutes", {
      headers: {
          'x-api-key': process.env.API_KEY
      }
  });
  const { educationinstitutes } = await res.json()
  return { props: { universities: educationinstitutes } }
}
export default UniversitiesDashboard
