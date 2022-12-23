import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import HighSchoolList from '../../../components/HighSchoolsList/HighSchoolsList'

const HighSchoolDashboard = ({ highschools }) => {
  console.log('high schools: ', highschools)
  return (
    <div style={{ height: '100vh' }}>
      <NavigationBar />
      <div className='d-flex' style={{ height: '100%' }}>
        <UserInfoSidebar />
        <HighSchoolList highSchools={highschools} />
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  const res = await fetch(process.env.BACKEND_PATH+"/highschools", {
          headers:{
              'x-api-key': process.env.API_KEY
          }
  });
  const { highschools } = await res.json()
  return { props: { highschools } }
}

export default HighSchoolDashboard
