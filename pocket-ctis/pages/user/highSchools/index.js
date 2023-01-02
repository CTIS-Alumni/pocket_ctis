import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import HighSchoolList from '../../../components/HighSchoolsList/HighSchoolsList'

const HighSchoolDashboard = ({ highschools }) => {
  console.log('high schools: ', highschools)
  return (
    <main>
      <NavigationBar />
      <UserInfoSidebar />
      <HighSchoolList highSchools={highschools} />
    </main>
  )
}

export async function getServerSideProps() {
  const res = await fetch('http://localhost:3000/api/highschools')
  const { highschools } = await res.json()
  return { props: { highschools } }
}

export default HighSchoolDashboard
