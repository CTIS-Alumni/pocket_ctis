import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import GraduationProjectsList from '../../../components/GraduationProjectsList/GraduationProjectsList'

const GraduationProjectsDashboard = ({ gradprojects }) => {
  return (
    <main>
      <NavigationBar />
      <UserInfoSidebar />
      <GraduationProjectsList graduationProjects={gradprojects} />
    </main>
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
