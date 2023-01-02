import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import UniversitiesList from '../../../components/UniversitiesList/UniversitiesList'

const UniversitiesDashboard = ({ universities }) => {
  return (
    <main>
      <NavigationBar />
      <UserInfoSidebar />
      <UniversitiesList universities={universities} />
    </main>
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
