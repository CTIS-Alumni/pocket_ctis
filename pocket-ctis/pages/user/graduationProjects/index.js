import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import GraduationProjectsList from '../../../components/GraduationProjectsList/GraduationProjectsList'

const GraduationProjectsDashboard = ({ gradprojects }) => {
  return (
    <div style={{ height: '100vh' }}>
      <NavigationBar />
      <div className='d-flex' style={{ height: '100%' }}>
        <UserInfoSidebar />
        <GraduationProjectsList graduationProjects={gradprojects} />
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  const res = await fetch(process.env.BACKEND_PATH+"/graduationprojects",{
      headers: {
          'x-api-key': process.env.API_KEY
      }
  });
  const { gradprojects } = await res.json()
  return { props: { gradprojects } }
}

export default GraduationProjectsDashboard
