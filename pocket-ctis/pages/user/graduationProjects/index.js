import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import GraduationProjectsList from '../../../components/GraduationProjectsList/GraduationProjectsList'
import { fetchAllGraduationProjects } from '../../../helpers/searchHelpers'

const GraduationProjectsDashboard = ({ gradprojects }) => {
  return (
    <main>
      <NavigationBar />
      <UserInfoSidebar />
      <GraduationProjectsList graduationProjects={gradprojects.data} />
    </main>
  )
}

export async function getServerSideProps() {
  const gradprojects = await fetchAllGraduationProjects()
  return { props: { gradprojects } }
}

export default GraduationProjectsDashboard
